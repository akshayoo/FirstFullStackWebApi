import "./globals.css"

export const metadata = {
  title: "tconsole",          
  description: "Theracues internal console for project management, sample tracking etc.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",      
  },
  robots : {
    index : false,
    follow : false,
    googleBot : {
      index : false,
      follow : false,
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="appWrapper">
            <main className="appContent">
              {children}
            </main>
        </div>
      </body>
    </html>
  )
}