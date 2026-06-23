"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { isPermissionError } from "@/lib/dashboard/errors";
import {
  BOOKING_SOURCES,
  CONSENT_SOURCES,
  CREATE_STATUSES,
  createManualReservation,
  emptyReservationForm,
  reservationFormSchema,
  type ReservationFormValues,
  type RoomOption,
} from "@/lib/dashboard/reservations";

type Status = "idle" | "saving" | "saved" | "error";

const OTHER_ROOM = "__other__";

/**
 * Manual booking form (client). Mobile-first, field order
 * name → dates → room → guests → phone (the <60s desk-entry path). Validates
 * with zod, then writes through the mig-082 RPC under RLS (owner|staff). A
 * permission error (viewer / cross-tenant) surfaces as a friendly notice, not
 * a stack trace (the RLS-is-the-gate contract).
 */
export function ReservationForm({
  propertyId,
  rooms,
}: {
  propertyId: string;
  rooms: RoomOption[];
}) {
  const t = useTranslations("dashboardApp.reservations");
  const te = useTranslations("dashboardApp.reservations.errors");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [customRoom, setCustomRoom] = useState(rooms.length === 0);
  // The room <select> is controlled so reset() after a create clears the visible
  // selection in lockstep with the RHF roomCode (an uncontrolled select would
  // keep showing the prior room while roomCode is empty → a confusing "required"
  // on the next booking).
  const [roomSelectValue, setRoomSelectValue] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: emptyReservationForm,
  });

  function err(field: keyof ReservationFormValues): string | null {
    const message = errors[field]?.message;
    return message ? te(message) : null;
  }

  function onRoomChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    setRoomSelectValue(value);
    if (value === OTHER_ROOM || value === "") {
      setCustomRoom(true);
      setValue("roomId", "");
      setValue("roomCode", "", { shouldValidate: false });
      return;
    }
    setCustomRoom(false);
    const room = rooms.find((r) => r.room_id === value);
    setValue("roomId", value);
    setValue("roomCode", room?.room_code ?? "", { shouldValidate: true });
  }

  async function onSubmit(values: ReservationFormValues) {
    setStatus("saving");
    try {
      const supabase = createClient();
      await createManualReservation(supabase, propertyId, values);
      setStatus("saved");
      reset(emptyReservationForm);
      setCustomRoom(rooms.length === 0);
      setRoomSelectValue(""); // clear the visible room selection with the RHF reset
      router.refresh(); // re-render the server list with the new row
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      // The RPC RAISEs 42501 for a viewer / wrong-tenant caller.
      setStatus("error");
      setFormError(isPermissionError(message) ? t("permissionError") : t("genericError"));
    }
  }

  const fieldClass =
    "border-line mt-1 w-full rounded-lg border bg-canvas/60 px-3 py-2 text-ink outline-none focus:border-turquoise-ink";
  const labelClass = "text-sm text-ink/70";
  const errorClass = "mt-1 text-xs text-coral";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={t("newBooking")}
      className="border-line bg-ink-panel grid grid-cols-1 gap-4 rounded-2xl border p-5 sm:grid-cols-2"
    >
      <h2 className="font-display col-span-full text-lg">{t("newBooking")}</h2>

      {/* name */}
      <div className="col-span-full">
        <label htmlFor="guestName" className={labelClass}>
          {t("fields.guestName")}
        </label>
        <input id="guestName" {...register("guestName")} className={fieldClass} />
        {err("guestName") && <p className={errorClass}>{err("guestName")}</p>}
      </div>

      {/* dates */}
      <div>
        <label htmlFor="checkIn" className={labelClass}>
          {t("fields.checkIn")}
        </label>
        <input id="checkIn" type="date" {...register("checkIn")} className={fieldClass} />
        {err("checkIn") && <p className={errorClass}>{err("checkIn")}</p>}
      </div>
      <div>
        <label htmlFor="checkOut" className={labelClass}>
          {t("fields.checkOut")}
        </label>
        <input id="checkOut" type="date" {...register("checkOut")} className={fieldClass} />
        {err("checkOut") && <p className={errorClass}>{err("checkOut")}</p>}
      </div>

      {/* room */}
      <div className={customRoom ? "" : "col-span-full"}>
        <label htmlFor="roomSelect" className={labelClass}>
          {t("fields.room")}
        </label>
        {rooms.length > 0 ? (
          <select
            id="roomSelect"
            value={roomSelectValue}
            onChange={onRoomChange}
            aria-label={t("fields.room")}
            className={fieldClass}
          >
            <option value="" disabled>
              —
            </option>
            {rooms.map((r) => (
              <option key={r.room_id} value={r.room_id}>
                {r.room_code} — {r.room_name}
              </option>
            ))}
            <option value={OTHER_ROOM}>{t("fields.roomCustom")}</option>
          </select>
        ) : null}
        {customRoom && (
          <input
            id="roomCode"
            {...register("roomCode")}
            placeholder={t("fields.roomCode")}
            aria-label={t("fields.roomCode")}
            className={`${fieldClass} ${rooms.length > 0 ? "mt-2" : ""}`}
          />
        )}
        {err("roomCode") && <p className={errorClass}>{err("roomCode")}</p>}
      </div>

      {/* guests */}
      <div>
        <label htmlFor="numGuests" className={labelClass}>
          {t("fields.numGuests")}
        </label>
        <input
          id="numGuests"
          type="number"
          min={1}
          {...register("numGuests")}
          className={fieldClass}
        />
        {err("numGuests") && <p className={errorClass}>{err("numGuests")}</p>}
      </div>

      {/* phone */}
      <div>
        <label htmlFor="guestPhone" className={labelClass}>
          {t("fields.guestPhone")}
        </label>
        <input
          id="guestPhone"
          type="tel"
          inputMode="tel"
          placeholder="+52..."
          {...register("guestPhone")}
          className={fieldClass}
        />
        {err("guestPhone") ? (
          <p className={errorClass}>{err("guestPhone")}</p>
        ) : (
          <p className="mt-1 text-xs text-ink/40">{t("fields.guestPhoneHint")}</p>
        )}
      </div>

      {/* email */}
      <div>
        <label htmlFor="guestEmail" className={labelClass}>
          {t("fields.guestEmail")}
        </label>
        <input
          id="guestEmail"
          type="email"
          {...register("guestEmail")}
          className={fieldClass}
        />
        {err("guestEmail") && <p className={errorClass}>{err("guestEmail")}</p>}
      </div>

      {/* price + payment */}
      <div>
        <label htmlFor="totalPriceMxn" className={labelClass}>
          {t("fields.totalPrice")}
        </label>
        <input
          id="totalPriceMxn"
          inputMode="decimal"
          {...register("totalPriceMxn")}
          className={fieldClass}
        />
        {err("totalPriceMxn") && <p className={errorClass}>{err("totalPriceMxn")}</p>}
      </div>
      <div>
        <label htmlFor="amountPaidMxn" className={labelClass}>
          {t("fields.amountPaid")}
        </label>
        <input
          id="amountPaidMxn"
          inputMode="decimal"
          {...register("amountPaidMxn")}
          className={fieldClass}
        />
        {err("amountPaidMxn") && <p className={errorClass}>{err("amountPaidMxn")}</p>}
      </div>
      <div>
        <label htmlFor="depositAmountMxn" className={labelClass}>
          {t("fields.deposit")}
        </label>
        <input
          id="depositAmountMxn"
          inputMode="decimal"
          {...register("depositAmountMxn")}
          className={fieldClass}
        />
        {err("depositAmountMxn") && <p className={errorClass}>{err("depositAmountMxn")}</p>}
      </div>
      <div>
        <label htmlFor="arrivalEta" className={labelClass}>
          {t("fields.arrivalEta")}
        </label>
        <input id="arrivalEta" type="time" {...register("arrivalEta")} className={fieldClass} />
        {err("arrivalEta") && <p className={errorClass}>{err("arrivalEta")}</p>}
      </div>

      {/* booking source + consent (D12) + status */}
      <div>
        <label htmlFor="bookingSource" className={labelClass}>
          {t("fields.bookingSource")}
        </label>
        <select id="bookingSource" {...register("bookingSource")} className={fieldClass}>
          {BOOKING_SOURCES.map((s) => (
            <option key={s} value={s}>
              {t(`sources.${s}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="outboundConsentSource" className={labelClass}>
          {t("fields.consent")}
        </label>
        <select
          id="outboundConsentSource"
          {...register("outboundConsentSource")}
          className={fieldClass}
        >
          {CONSENT_SOURCES.map((s) => (
            <option key={s} value={s}>
              {t(`consents.${s}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status" className={labelClass}>
          {t("fields.status")}
        </label>
        <select id="status" {...register("status")} className={fieldClass}>
          {CREATE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`statuses.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {/* notes */}
      <div className="col-span-full">
        <label htmlFor="specialRequests" className={labelClass}>
          {t("fields.specialRequests")}
        </label>
        <textarea
          id="specialRequests"
          rows={2}
          {...register("specialRequests")}
          className={fieldClass}
        />
      </div>

      <div className="col-span-full flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-turquoise-deep hover:bg-turquoise rounded-lg px-5 py-2 font-medium text-white transition-colors disabled:opacity-60"
        >
          {status === "saving" ? t("creating") : t("create")}
        </button>
        {status === "saved" && (
          <span role="status" className="text-sm text-turquoise-ink">
            {t("createdToast")}
          </span>
        )}
        {status === "error" && formError && (
          <span role="alert" className="text-sm text-coral">
            {formError}
          </span>
        )}
      </div>
    </form>
  );
}
