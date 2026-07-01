"use client";

import { useState, FormEvent } from "react";
import { weddingDate } from "@/lib/wedding-content";
import { foodOptions } from "@/lib/wedding-data";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

type FormData = {
  invitationCode: string;
  guestName: string;
  adults: string;
  children: string;
  foodPreference: string;
  message: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

export default function RSVPSection() {
  const [form, setForm] = useState<FormData>({
    invitationCode: "",
    guestName: "",
    adults: "",
    children: "",
    foodPreference: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API call — will be wired to backend later
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setForm({
        invitationCode: "",
        guestName: "",
        adults: "",
        children: "",
        foodPreference: "",
        message: "",
      });
      // Reset success message after a few seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <section
      id="rsvp"
      className="section-rsvp relative w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 0 }}>
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(216,178,110,0.03) 0%, rgba(201,143,162,0.05) 50%, rgba(216,178,110,0.03) 100%)",
          }}
        />
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
        <h2 className="section-title font-headings text-cream-foreground mb-2">
          RSVP
        </h2>
        <div className="divider-row mb-10">
          <div className="gold-divider" />
          <HeartSVG />
          <div className="gold-divider" />
        </div>

        {/* Status toast */}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 w-full rounded-lg p-4 text-center font-body text-sm"
            style={{
              background: "rgba(216, 178, 110, 0.15)",
              border: "1px solid rgba(216, 178, 110, 0.4)",
              color: "#3a2d2d",
            }}
          >
            🎉 Thank you! Your RSVP has been received. We can&apos;t wait to
            celebrate with you!
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 w-full rounded-lg p-4 text-center font-body text-sm"
            style={{
              background: "rgba(201, 143, 162, 0.15)",
              border: "1px solid rgba(201, 143, 162, 0.4)",
              color: "#3a2d2d",
            }}
          >
            Something went wrong. Please try again.
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="section-card w-full p-6 md:p-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
        >
          <div className="flex flex-col gap-4">
            {/* Invitation Code */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Invitation Code
              </label>
              <input
                type="text"
                name="invitationCode"
                value={form.invitationCode}
                onChange={handleChange}
                placeholder="Enter your invitation code"
                className="rsvp-field font-body"
                required
              />
            </motion.div>

            {/* Guest Name */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Guest Name
              </label>
              <input
                type="text"
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
                placeholder="Your full name"
                className="rsvp-field font-body"
                required
              />
            </motion.div>

            {/* Adults */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Number of Adults
              </label>
              <input
                type="number"
                name="adults"
                value={form.adults}
                onChange={handleChange}
                placeholder="e.g. 2"
                min={0}
                max={10}
                className="rsvp-field font-body"
                required
              />
            </motion.div>

            {/* Children */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Number of Children
              </label>
              <input
                type="number"
                name="children"
                value={form.children}
                onChange={handleChange}
                placeholder="e.g. 1"
                min={0}
                max={10}
                className="rsvp-field font-body"
              />
            </motion.div>

            {/* Food Preference */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-1 block">
                Food Preference
              </label>
              <select
                name="foodPreference"
                value={form.foodPreference}
                onChange={handleChange}
                className="rsvp-field font-body"
              >
                {foodOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Message */}
            <motion.div variants={staggerItem}>
              <label className="rsvp-label font-body text-xs tracking-wider uppercase mb-2 block">
                Message / Blessings
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Share a blessing or message for the couple..."
                rows={3}
                className="rsvp-field font-body resize-none"
              />
            </motion.div>

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
    </section>
  );
}
