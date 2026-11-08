"use client";

import { DoDont, Quiz } from "../../../components/Quiz";
import SectionIntro from "../../../components/SectionIntro";
import { QUIZ } from "../data/quiz";

const DO = [
  <>
    Cek <strong>iDRAC Dashboard dan log</strong> sebelum menyimpulkan apa pun.
  </>,
  <>
    <strong>Blink</strong> komponen dan cocokkan nomor bay/slot sebelum
    mencabut.
  </>,
  <>
    Catat <strong>Service Tag</strong>, waktu kejadian, dan kumpulkan{" "}
    <strong>TSR</strong> saat buka tiket ke Dell.
  </>,
  <>
    Pastikan RAID <strong>selesai rebuild</strong> sebelum pekerjaan lain di
    server yang sama.
  </>,
  <>
    Update firmware dan reboot hanya di <strong>maintenance window</strong>{" "}
    dengan MOP.
  </>,
  <>
    Pakai <strong>ESD strap</strong> saat menyentuh komponen di dalam server.
  </>,
];

const DONT = [
  'Mencabut disk "kira-kira" tanpa Blink, apalagi di RAID yang sudah degraded.',
  "Menahan tombol power (force off) server production tanpa izin.",
  "Mencabut kedua PSU atau kabel di jalur listrik yang salah.",
  "Mengubah BIOS, boot mode, atau RAID tanpa MOP.",
  'Membiarkan PSU atau disk rusak "karena server masih nyala": redundansinya sudah hilang.',
  "Menyimpan password iDRAC di catatan atau chat biasa.",
];

export default function QuizSection() {
  return (
    <>
      <SectionIntro title="Yang wajib diperhatikan">
        Aturan yang paling sering menyelamatkan dari outage saat pegang server.
      </SectionIntro>
      <DoDont dos={DO} donts={DONT} />
      <Quiz items={QUIZ} idPrefix="dell" />
    </>
  );
}
