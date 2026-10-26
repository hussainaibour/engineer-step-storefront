import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp({ number }: { number: string }) {
  if (!number) return null;
  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل مع المتجر عبر واتساب"
      className="fixed bottom-5 start-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#128c4a] text-white shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
