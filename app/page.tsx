import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4 sm:p-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 text-foreground">
        Discover Suppliers and Products
      </h1>
      <p className="text-lg text-center mb-8 text-muted-foreground max-w-2xl">
        Your AI-Powered B2B Marketplace for seamless sourcing.
      </p>
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input type="text" placeholder="Search for products or suppliers..." className="flex-grow" />
        <Button type="submit">Search</Button>
      </div>

      <section className="mt-16 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">How TradeConnect Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">1. Search & Discover</h3>
            <p className="text-muted-foreground">Find suppliers and products that meet your business needs.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.702 9.702 0 015 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">2. Connect & Negotiate</h3>
            <p className="text-muted-foreground">Connect with suppliers directly to discuss your requirements.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">3. Transact & Manage</h3>
            <p className="text-muted-foreground">Securely transact and manage your orders through our platform.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
