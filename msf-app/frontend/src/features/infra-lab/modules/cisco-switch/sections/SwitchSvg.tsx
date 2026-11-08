"use client";

import {
  DEVICE,
  Hotspot,
  SvgLabel as Label,
} from "../../../components/device/Hotspot";
import { SWITCH_PARTS, type SwitchPartId } from "../data/parts";

/** Ilustrasi umum switch 1U 48 port (bukan model tertentu). */

interface SwitchSvgProps {
  view: "front" | "rear";
  selected: SwitchPartId;
  onPick: (id: SwitchPartId) => void;
}

/** Port nomor 12 (baris bawah) amber: port err-disabled di simulasi. */
const AMBER_PORT = 12;

function Front({ selected, onPick }: Omit<SwitchSvgProps, "view">) {
  const hs = (id: SwitchPartId) => ({
    label: SWITCH_PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
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

      <Hotspot {...hs("leds")} x={12} y={24} w={76} h={100}>
        <rect
          x={16}
          y={28}
          width={68}
          height={92}
          rx={4}
          fill={DEVICE.chassis2}
        />
        <circle cx={30} cy={46} r={4} fill={DEVICE.ledGreen} />
        <Label x={40} y={50}>
          SYST
        </Label>
        <circle cx={30} cy={66} r={4} fill={DEVICE.ledGreen} />
        <Label x={40} y={70}>
          STAT
        </Label>
        <rect
          x={24}
          y={86}
          width={52}
          height={18}
          rx={9}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <text
          x={50}
          y={99}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill="#b8c0c9"
        >
          MODE
        </text>
      </Hotspot>

      <Hotspot {...hs("ports")} x={96} y={24} w={520} h={100}>
        {Array.from({ length: 24 }, (_, i) => {
          const x = 102 + i * 21 + Math.floor(i / 12) * 8;
          const top = i * 2 + 1;
          const bottom = i * 2 + 2;
          const led = (n: number) =>
            n === AMBER_PORT
              ? DEVICE.ledAmber
              : n % 5 === 0
                ? DEVICE.ledOff
                : DEVICE.ledGreen;
          return (
            <g key={i}>
              <rect x={x} y={40} width={18} height={4} rx={1} fill={led(top)} />
              <rect
                x={x}
                y={48}
                width={18}
                height={14}
                rx={2}
                fill="#111"
                stroke={DEVICE.portStroke}
              />
              <rect
                x={x}
                y={80}
                width={18}
                height={14}
                rx={2}
                fill="#111"
                stroke={DEVICE.portStroke}
              />
              <rect
                x={x}
                y={98}
                width={18}
                height={4}
                rx={1}
                fill={led(bottom)}
              />
            </g>
          );
        })}
        <Label x={102} y={36}>
          1
        </Label>
        <Label x={102} y={116}>
          2
        </Label>
        <Label x={593} y={116}>
          48
        </Label>
      </Hotspot>

      <Hotspot {...hs("uplinks")} x={628} y={30} w={110} h={60}>
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect
              x={634 + k * 26}
              y={40}
              width={22}
              height={30}
              rx={2}
              fill="#111"
              stroke={DEVICE.portStroke}
            />
            <rect
              x={638 + k * 26}
              y={72}
              width={14}
              height={3}
              rx={1}
              fill={k === 0 ? DEVICE.ledGreen : DEVICE.ledOff}
            />
          </g>
        ))}
        <Label x={634} y={86}>
          1/1/1 - 1/1/4
        </Label>
      </Hotspot>

      <Hotspot {...hs("usb")} x={746} y={30} w={44} h={44}>
        <rect
          x={756}
          y={42}
          width={24}
          height={10}
          rx={2}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <Label x={768} y={66} anchor="middle">
          USB
        </Label>
      </Hotspot>
    </>
  );
}

function Rear({ selected, onPick }: Omit<SwitchSvgProps, "view">) {
  const hs = (id: SwitchPartId) => ({
    label: SWITCH_PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  const psu = (id: SwitchPartId, x: number, label: string) => (
    <Hotspot {...hs(id)} x={x - 4} y={24} w={158} h={104}>
      <rect
        x={x}
        y={28}
        width={150}
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
          x2={x + 106}
          y2={44 + r * 14}
          stroke="#353b42"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
      <circle cx={x + 128} cy={104} r={5} fill={DEVICE.ledGreen} />
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

      <Hotspot {...hs("console")} x={14} y={28} w={72} h={44}>
        <rect
          x={22}
          y={38}
          width={28}
          height={22}
          rx={2}
          fill="#24476b"
          stroke={DEVICE.portStroke}
        />
        <Label x={56} y={53}>
          CON
        </Label>
      </Hotspot>

      <Hotspot {...hs("mgmt")} x={14} y={78} w={72} h={44}>
        <rect
          x={22}
          y={88}
          width={28}
          height={22}
          rx={2}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <Label x={56} y={103}>
          MGMT
        </Label>
      </Hotspot>

      <Hotspot {...hs("stack")} x={96} y={28} w={154} h={94}>
        <rect
          x={104}
          y={44}
          width={64}
          height={28}
          rx={4}
          fill="#464d56"
          stroke={DEVICE.edge}
        />
        <rect
          x={178}
          y={44}
          width={64}
          height={28}
          rx={4}
          fill="#464d56"
          stroke={DEVICE.edge}
        />
        <Label x={108} y={92}>
          STACK 1
        </Label>
        <Label x={182} y={92}>
          STACK 2
        </Label>
      </Hotspot>

      <Hotspot {...hs("fan")} x={262} y={24} w={182} h={104}>
        {[300, 352, 404].map((cx) => (
          <g key={cx}>
            <circle
              cx={cx}
              cy={76}
              r={22}
              fill={DEVICE.bay}
              stroke={DEVICE.edge}
            />
            <path
              d={`M${cx - 14} ${76}h28M${cx} ${62}v28`}
              stroke="#353b42"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </g>
        ))}
        <Label x={340} y={118}>
          FAN
        </Label>
      </Hotspot>

      {psu("psu1", 462, "PSU 1")}
      {psu("psu2", 634, "PSU 2")}
    </>
  );
}

export default function SwitchSvg({ view, selected, onPick }: SwitchSvgProps) {
  return (
    <svg
      viewBox="0 0 800 150"
      role="group"
      aria-label={
        view === "front" ? "Tampak depan switch" : "Tampak belakang switch"
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
