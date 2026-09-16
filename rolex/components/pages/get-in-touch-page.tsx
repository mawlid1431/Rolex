"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { localPath, ROUTES } from "@/lib/site"

export function GetInTouchPage() {
  const [sent, setSent] = useState(false)

  return (
    <>
      <main id="main">
        <section className="full-grid bg-[rgb(var(--light-beige))] px-[var(--outer-margin)] py-[clamp(3rem,10vw,6rem)]">
          <div className="col-[main] m:col-[col_3/span_8]">
            <p className="surtitle70 mb-3 text-green">Contact</p>
            <h1 className="headline50 mb-4">Get in touch</h1>
            <p className="body100 mb-10 max-w-xl font-light text-dark-grey">
              Speak with an Official Rolex Retailer about a watch from your cart or wishlist, or ask any question about the collection.
            </p>

            {sent ? (
              <div className="rounded-sm border border-green/30 bg-white p-8">
                <h2 className="headline50 mb-2 text-[1.5rem]">Thank you</h2>
                <p className="body100 mb-6 font-light text-dark-grey">
                  Your message has been recorded locally for this demo. An Official Rolex Retailer can help you continue.
                </p>
                <Link href={localPath(ROUTES.cart)} className="btn btn-filled inline-flex min-h-11 items-center rounded-full px-6 text-sm">
                  Back to cart
                </Link>
              </div>
            ) : (
              <form
                className="grid max-w-xl gap-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <label className="grid gap-2">
                  <span className="legend100 font-bold">Name</span>
                  <input
                    required
                    name="name"
                    className="min-h-12 rounded-sm border border-black/15 bg-white px-4"
                    autoComplete="name"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="legend100 font-bold">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="min-h-12 rounded-sm border border-black/15 bg-white px-4"
                    autoComplete="email"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="legend100 font-bold">Message</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="rounded-sm border border-black/15 bg-white px-4 py-3"
                  />
                </label>
                <button type="submit" className="btn btn-filled inline-flex min-h-11 w-fit items-center rounded-full px-6 text-sm">
                  Send message
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer
        breadcrumb={[
          { title: "Home", href: "/" },
          { title: "Get in touch", href: "/get-in-touch" },
        ]}
      />
    </>
  )
}
