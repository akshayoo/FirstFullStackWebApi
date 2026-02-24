
import "./globals.css"

export const metadata = {
  title: "tconsole",          
  description: "Theracues internal console for project management, sample tracking etc.",
  icons: {
    icon: "/favicon.ico",      
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
