import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ApolloWrapper } from '@/src/libs/apollo-wrapper';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lawpath Form',
  description: 'Online form to capture Postcode, Suburb & State.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
