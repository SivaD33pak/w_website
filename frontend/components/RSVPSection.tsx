"use client";

import { useState, FormEvent, useMemo } from "react";
import { weddingDate } from "@/lib/wedding-content";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { ApiError, submitRsvp } from "@/lib/api";
import { generateStars, generateSparkles } from "@/lib/stars";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Side = "" | "bride" | "groom";
type Relation = "" | "friend" | "family";
type Coming = null | boolean;

type FormData = {
  fullName: string;
  place: string;
  whatsappNumber: string; // 10 raw digits, displayed with a +91 prefix
  side: Side;
  relation: Relation;
  coming: Coming;
  guests: string;
};

/** Submit status for the RSVP payload. */
type FormStatus = "idle" | "submitting" | "success" | "error";

/** Inline validation errors for all required fields. */
type FormErrors = {
  fullName?: string;
  place?: string;
  whatsapp?: string;
  side?: string;
  relation?: string;
  coming?: string;
};

const EMPTY_FORM: FormData = {
  fullName: "",
  place: "",
  whatsappNumber: "",
  side: "",
  relation: "",
  coming: null,
  guests: "1",
};

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

/** A 4-point sparkle star for the background field. */
function FieldSparkle({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6,0 L7,5 L12,6 L7,7 L6,12 L5,7 L0,6 L5,5 Z"
        fill="#D8B26E"
      />
    </svg>
  );
}

export default function RSVPSection() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedName, setSavedName] = useState<string | null>(null);

  const stars = useMemo(() => generateStars(50, 42), []);
  const sparkles = useMemo(() => generateSparkles(5, 53), []);

  // ---------------------------------------------------------------------------
  // Field helpers
  // ---------------------------------------------------------------------------

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "whatsappNumber") {
      setErrors((prev) => ({ ...prev, whatsapp: undefined }));
    }
  }

  function pickSide(side: Exclude<Side, "">) {
    setForm((prev) => ({ ...prev, side }));
    setErrors((prev) => ({ ...prev, side: undefined }));
  }

  function pickRelation(relation: Exclude<Relation, "">) {
    setForm((prev) => ({ ...prev, relation }));
    setErrors((prev) => ({ ...prev, relation: undefined }));
  }

  function pickComing(value: boolean) {
    setForm((prev) => ({ ...prev, coming: value }));
    setErrors((prev) => ({ ...prev, coming: undefined }));
  }

  // ---------------------------------------------------------------------------
  // Validation — runs before submit so no required field can be left blank
  // ---------------------------------------------------------------------------

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (form.fullName.trim().length < 2) {
      next.side = "Please fill out every field."; // top-of-form hint
    }
    if (form.place.trim().length < 1) {
      next.place = "Please enter your place or town.";
    }
    const digits = form.whatsappNumber.replace(/\D/g, "");
    if (digits.length !== 10) {
      next.whatsapp = "Enter a valid 10-digit WhatsApp number.";
    }
    if (!form.side) {
      next.side = next.side || "Please choose Bride side or Groom side.";
    }
    // Relation is only shown after a side is picked, but still required.
    if (!form.relation) {
      next.relation = "Please choose Friend or Family.";
    }
    if (form.coming === null) {
      next.coming = "Please let us know if you will attend.";
    }

    return next;
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setErrors({});

    setStatus("submitting");
    setSubmitMessage(null);

    const digits = form.whatsappNumber.replace(/\D/g, "");

    try {
      const result = await submitRsvp({
        fullName: form.fullName.trim(),
        place: form.place.trim(),
        whatsappNumber: `+91${digits}`,
        side: form.side as "bride" | "groom",
        relation: form.relation as "friend" | "family",
        coming: form.coming === true,
        guests: form.coming ? Number(form.guests) || 1 : 0,
      });

      if (result.saved) {
        setStatus("success");
        setSavedName(form.fullName.trim());
        setSubmitMessage(
          result.message ||
            "Thank you! Your RSVP has been received. We can't wait to celebrate with you!",
        );
        setForm(EMPTY_FORM);
        setTimeout(() => {
          setStatus("idle");
          setSubmitMessage(null);
          setSavedName(null);
        }, 6000);
      } else {
        setStatus("error");
        setSubmitMessage(
          result.message || "Your RSVP could not be saved. Please try again.",
        );
        setTimeout(() => {
          setStatus("idle");
          setSubmitMessage(null);
        }, 6000);
      }
    } catch (err) {
      setStatus("error");
      setSubmitMessage(
        err instanceof ApiError && err.status === 422
          ? "Please fill out every field before submitting."
          : err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again.",
      );
      setTimeout(() => {
        setStatus("idle");
        setSubmitMessage(null);
      }, 6000);
    }
  }

  const attending = form.coming === true;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      id="rsvp"
      className="section-rsvp relative w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Night-sky background: nebula glows */}
      <div
        className="events-nebula"
        style={{
          top: "15%",
          right: "8%",
          width: "35vw",
          height: "35vw",
          maxWidth: 350,
          maxHeight: 350,
          background:
            "radial-gradient(circle, rgba(216,178,110,0.14) 0%, transparent 70%)",
        }}
      />
      <div
        className="events-nebula"
        style={{
          bottom: "10%",
          left: "10%",
          width: "32vw",
          height: "32vw",
          maxWidth: 320,
          maxHeight: 320,
          background:
            "radial-gradient(circle, rgba(201,143,162,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Twinkling star field */}
      <div className="events-stars">
        {stars.map((s, i) => (
          <div
            key={`rsvp-star-${i}`}
            className={`events-star${s.tier >= 2 ? " gold" : ""}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {sparkles.map((sp, i) => (
          <div
            key={`rsvp-sparkle-${i}`}
            className="events-sparkle"
            style={{
              top: `${sp.top}%`,
              left: `${sp.left}%`,
              animationDuration: `${sp.duration}s`,
              animationDelay: `${sp.delay}s`,
            }}
          >
            <FieldSparkle size={sp.size} />
          </div>
        ))}
      </div>

      <motion.div
        className="relative flex flex-col items-center w-full max-w-xl px-4"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className="section-eyebrow font-body text-xs tracking-widest uppercase mb-2">
          KINDLY RESPOND BY {weddingDate.rsvpDeadline}
        </p>
        <h2 className="section-title font-headings mb-2">
          RSVP
        </h2>
        <div className="divider-row mb-10">
          <div className="gold-divider" />
          <HeartSVG />
          <div className="gold-divider" />
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="section-card w-full p-6 md:p-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          noValidate
        >
          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="rsvp-field font-body"
                required
                minLength={2}
              />
            </motion.div>

            {/* Place / Town */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Place / Town
              </label>
              <input
                type="text"
                name="place"
                value={form.place}
                onChange={handleChange}
                placeholder="Where you're coming from"
                className="rsvp-field font-body"
                required
              />
              {errors.place && (
                <p
                  className="font-body text-xs mt-2"
                  style={{ color: "#e88a9a" }}
                >
                  {errors.place}
                </p>
              )}
            </motion.div>

            {/* WhatsApp Number (with fixed +91 prefix) */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                WhatsApp Number
              </label>
              <div className="flex">
                <span
                  className="flex items-center justify-center px-4 rounded-l-lg font-body text-sm font-medium"
                  style={{
                    background: "rgba(216, 178, 110, 0.15)",
                    border: "1px solid rgba(216, 178, 110, 0.4)",
                    borderRight: "none",
                    color: "#f6f0e8",
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="rsvp-field font-body rounded-l-none"
                  required
                />
              </div>
              {errors.whatsapp && (
                <p
                  className="font-body text-xs mt-2"
                  style={{ color: "#e88a9a" }}
                >
                  {errors.whatsapp}
                </p>
              )}
            </motion.div>

            {/* Bride side / Groom side */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-2 block">
                You are on the
              </label>
              <div className="flex gap-3">
                <ChoiceOption
                  label="Bride Side"
                  selected={form.side === "bride"}
                  onClick={() => pickSide("bride")}
                />
                <ChoiceOption
                  label="Groom Side"
                  selected={form.side === "groom"}
                  onClick={() => pickSide("groom")}
                />
              </div>
              {errors.side && (
                <p
                  className="font-body text-xs mt-2"
                  style={{ color: "#e88a9a" }}
                >
                  {errors.side}
                </p>
              )}
            </motion.div>

            {/* Relation — only shown after a side is picked */}
            <AnimatePresence initial={false}>
              {form.side && (
                <motion.div
                  key="relation"
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-2 block">
                    Relation
                  </label>
                  <div className="flex gap-3">
                    <ChoiceOption
                      label="Friend"
                      selected={form.relation === "friend"}
                      onClick={() => pickRelation("friend")}
                    />
                    <ChoiceOption
                      label="Family"
                      selected={form.relation === "family"}
                      onClick={() => pickRelation("family")}
                    />
                  </div>
                  {errors.relation && (
                    <p
                      className="font-body text-xs mt-2"
                      style={{ color: "#e88a9a" }}
                    >
                      {errors.relation}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Will you attend? */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-2 block">
                Will you attend?
              </label>
              <div className="flex gap-3">
                <ChoiceOption
                  label="Joyfully Accept"
                  selected={form.coming === true}
                  onClick={() => pickComing(true)}
                />
                <ChoiceOption
                  label="Regretfully Decline"
                  selected={form.coming === false}
                  onClick={() => pickComing(false)}
                />
              </div>
              {errors.coming && (
                <p
                  className="font-body text-xs mt-2"
                  style={{ color: "#e88a9a" }}
                >
                  {errors.coming}
                </p>
              )}
            </motion.div>

            {/* Number of Guests — only relevant when attending */}
            <AnimatePresence initial={false}>
              {attending && (
                <motion.div
                  key="guests"
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    min={1}
                    max={20}
                    className="rsvp-field font-body"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div variants={staggerItem}>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rsvp-submit w-full flex items-center justify-center gap-3 mt-2 font-body font-medium text-sm tracking-widest uppercase text-foreground py-4 rounded-full"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
                </svg>
                {status === "submitting" ? "SENDING..." : "SEND WITH LOVE"}
              </button>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>

      {/* Centered popup — success / error */}
      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-6 left-0 z-50 flex items-center justify-center px-4"
          >
            <div
              className="flex items-center justify-center gap-3 px-6 py-5 sm:px-8 sm:py-6 rounded-2xl font-body text-sm text-center shadow-2xl w-full"
              style={{
                maxWidth: "calc(100% - 2rem)",
                background:
                  status === "success"
                    ? "linear-gradient(135deg, rgba(216, 178, 110, 0.95), rgba(201, 143, 162, 0.9))"
                    : "linear-gradient(135deg, rgba(201, 143, 162, 0.95), rgba(155, 68, 83, 0.9))",
                color: status === "success" ? "#181b3a" : "#f6f0e8",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow:
                  status === "success"
                    ? "0 8px 60px rgba(216, 178, 110, 0.5), 0 0 0 1px rgba(216, 178, 110, 0.1)"
                    : "0 8px 60px rgba(201, 143, 162, 0.5), 0 0 0 1px rgba(201, 143, 162, 0.1)",
              }}
            >
            {status === "success" ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>
                  🎉 RSVP saved successfully. Thank you, {savedName}!
                </span>
              </>
            ) : (
              <span>{submitMessage}</span>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Reusable toggle option button (used for side, relation, and attending)
// ---------------------------------------------------------------------------

function ChoiceOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      /* Tighter padding + tracking on mobile so the two toggle buttons fit
         side-by-side on narrow screens; relax to the wider style on sm+. */
      className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-body text-[10px] leading-tight tracking-wide uppercase transition-colors sm:px-4 sm:text-xs sm:tracking-wider"
      style={{
        background: selected ? "rgba(216, 178, 110, 0.15)" : "transparent",
        border: selected
          ? "1px solid rgba(216, 178, 110, 0.6)"
          : "1px solid rgba(246, 240, 232, 0.15)",
        color: "#f6f0e8",
        fontWeight: selected ? 600 : 400,
      }}
    >
      <span
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: 14,
          height: 14,
          minWidth: 14,
          border: selected
            ? "5px solid #d8b26e"
            : "1px solid rgba(246, 240, 232, 0.35)",
        }}
      />
      {label}
    </button>
  );
}
