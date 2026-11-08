"use client";

import {
  DEVICE,
  Hotspot,
  SvgLabel as Label,
} from "../../../components/device/Hotspot";
import { PALO_PARTS, type PaloPartId } from "../data/parts";

/** Ilustrasi umum firewall 1U (bukan model tertentu). */

interface FirewallSvgProps {
  view: "front" | "rear";
  selected: PaloPartId;
  onPick: (id: PaloPartId) => void;
}

const LEDS: [string, string][] = [
  ["PWR", DEVICE.ledGreen],
  ["STS", DEVICE.ledGreen],
  ["HA", DEVICE.ledGreen],
  ["TEMP", DEVICE.ledGreen],
  ["ALM", DEVICE.ledOff],
];

function Front({ selected, onPick }: Omit<FirewallSvgProps, "view">) {
  const hs = (id: PaloPartId) => ({
    label: PALO_PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  const rj = (x: number, y: number, fill = "#111") => (
    <rect
      x={x}
      y={y}
      width={28}
      height={20}
      rx={2}
      fill={fill}
      stroke={DEVICE.portStroke}
    />
  );
  return (
    <>
      <rect
        x={5}
        y={15}
        width={790}
        height={120}
        rx={6}
        fill={DEVICE.chassis}
      />

      <Hotspot {...hs("leds")} x={12} y={22} w={92} h={106}>
        <rect
          x={16}
          y={26}
          width={84}
          height={98}
          rx={4}
          fill={DEVICE.chassis2}
        />
        {LEDS.map(([label, color], i) => (
          <g key={label}>
            <circle cx={28} cy={42 + i * 17} r={3.5} fill={color} />
            <Label x={38} y={46 + i * 17}>
              {label}
            </Label>
          </g>
        ))}
      </Hotspot>

      <Hotspot {...hs("mgmt")} x={112} y={30} w={52} h={64}>
        {rj(120, 44)}
        <Label x={120} y={84}>
          MGT
        </Label>
      </Hotspot>

      <Hotspot {...hs("console")} x={168} y={30} w={56} h={64}>
        {rj(176, 44, "#24476b")}
        <Label x={176} y={84}>
          CON
        </Label>
      </Hotspot>

      <Hotspot {...hs("usb")} x={228} y={30} w={50} h={64}>
        <rect
          x={238}
          y={48}
          width={26}
          height={10}
          rx={2}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <Label x={238} y={84}>
          USB
        </Label>
      </Hotspot>

      <Hotspot {...hs("ha")} x={286} y={30} w={96} h={64}>
        {rj(294, 44)}
        {rj(338, 44)}
        <Label x={294} y={84}>
          HA1 HA2
        </Label>
      </Hotspot>

      <Hotspot {...hs("data")} x={392} y={22} w={214} h={106}>
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect
              x={400 + k * 50}
              y={32}
              width={40}
              height={4}
              rx={1}
              fill={k === 3 ? DEVICE.ledOff : DEVICE.ledGreen}
            />
            <rect
              x={400 + k * 50}
              y={38}
              width={40}
              height={24}
              rx={2}
              fill="#111"
              stroke={DEVICE.portStroke}
            />
            <rect
              x={400 + k * 50}
              y={70}
              width={40}
              height={24}
              rx={2}
              fill="#111"
              stroke={DEVICE.portStroke}
            />
            <rect
              x={400 + k * 50}
              y={96}
              width={40}
              height={4}
              rx={1}
              fill={DEVICE.ledOff}
            />
          </g>
        ))}
        <Label x={400} y={120}>
          ethernet1/1 - 1/8
        </Label>
      </Hotspot>

      <Hotspot {...hs("sfp")} x={616} y={22} w={172} h={106}>
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect
              x={626 + k * 40}
              y={44}
              width={32}
              height={40}
              rx={2}
              fill="#111"
              stroke={DEVICE.portStroke}
            />
            <rect
              x={632 + k * 40}
              y={88}
              width={20}
              height={3}
              rx={1}
              fill={k === 0 ? DEVICE.ledGreen : DEVICE.ledOff}
            />
          </g>
        ))}
        <Label x={626} y={120}>
          ethernet1/9 - 1/12
        </Label>
      </Hotspot>
    </>
  );
}

function Rear({ selected, onPick }: Omit<FirewallSvgProps, "view">) {
  const hs = (id: PaloPartId) => ({
    label: PALO_PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  const psu = (id: PaloPartId, x: number, label: string) => (
    <Hotspot {...hs(id)} x={x - 4} y={24} w={188} h={104}>
      <rect
        x={x}
        y={28}
        width={180}
        height={96}
        rx={5}
        fill="#464d56"
        stroke="#5b636d"
      />
      {Array.from({ length: 4 }, (_, r) => (
        <line
          key={r}
          x1={x + 14}
          y1={44 + r * 14}
          x2={x + 130}
          y2={44 + r * 14}
          stroke="#353b42"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
      <circle cx={x + 158} cy={104} r={5} fill={DEVICE.ledGreen} />
      <Label x={x + 14} y={112}>
        {label}
      </Label>
    </Hotspot>
  );
  return (
    <>
      <rect
        x={5}
        y={15}
        width={790}
        height={120}
        rx={6}
        fill={DEVICE.chassis}
      />
      {psu("psu1", 20, "PSU 1")}
      {psu("psu2", 214, "PSU 2")}
      <Hotspot {...hs("fans")} x={412} y={24} w={376} h={104}>
        {[460, 548, 636, 724].map((cx) => (
          <g key={cx}>
            <circle
              cx={cx}
              cy={72}
              r={34}
              fill={DEVICE.bay}
              stroke={DEVICE.edge}
            />
            <path
              d={`M${cx - 22} 72h44M${cx} 50v44`}
              stroke="#353b42"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </g>
        ))}
        <Label x={420} y={122}>
          FAN
        </Label>
      </Hotspot>
    </>
  );
}

export default function FirewallSvg({
  view,
  selected,
  onPick,
}: FirewallSvgProps) {
  return (
    <svg
      viewBox="0 0 800 150"
      role="group"
      aria-label={
        view === "front" ? "Tampak depan firewall" : "Tampak belakang firewall"
      }
      className="block h-auto w-full min-w-[560px] font-sans"
    >
      {view === "front" ? (
        <Front selected={selected} onPick={onPick} />
      ) : (
        <Rear selected={selected} onPick={onPick} />
      )}
    </svg>
  );
}
