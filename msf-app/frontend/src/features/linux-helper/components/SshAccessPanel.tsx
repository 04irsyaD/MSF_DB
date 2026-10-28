import { Keyboard } from "lucide-react";
import TerminalBlock from "./TerminalBlock";
import Keycap from "./Keycap";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";

const SSH_EXAMPLES = [
  "# Sambung ke server (user & host punya kamu sendiri)",
  "ssh user@192.168.1.10",
  "# Kalau port SSH bukan 22 (mis. 2222)",
  "ssh -p 2222 user@192.168.1.10",
].join("\n");

/** Panel "Cara masuk ke server": contoh perintah SSH + tips buka terminal Windows. */
export default function SshAccessPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold text-foreground">{L.sections.ssh}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{L.ssh.description}</p>

      <div className="mt-3">
        <TerminalBlock command={SSH_EXAMPLES} />
      </div>

      <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <Keyboard className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          {L.ssh.windowsHint.split("Win + X")[0]}
          <Keycap keys={["Win", "X"]} className="mx-0.5 align-middle" />
          {L.ssh.windowsHint.split("Win + X")[1]}
        </span>
      </p>
    </section>
  );
}
