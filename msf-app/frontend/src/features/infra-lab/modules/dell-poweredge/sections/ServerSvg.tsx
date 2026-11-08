"use client";

import {
  DEVICE,
  Hotspot,
  SvgLabel as Label,
} from "../../../components/device/Hotspot";
import { PARTS, type PartId, type ServerView } from "../data/parts";

/** Ilustrasi umum server 2U (bukan model tertentu). Warna chassis tetap gelap di kedua tema. */

interface ServerSvgProps {
  view: ServerView;
  selected: PartId;
  onPick: (id: PartId) => void;
  /** Bay dengan lampu status amber (disk bermasalah). */
  amberBay?: number;
}

function FrontView({
  selected,
  onPick,
  amberBay,
}: Omit<ServerSvgProps, "view">) {
  const hs = (id: PartId) => ({
    label: PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  return (
    <>
      <rect
        x={5}
        y={15}
        width={790}
        height={160}
        rx={8}
        fill={DEVICE.chassis}
      />
      <rect
        x={5}
        y={15}
        width={78}
        height={160}
        rx={8}
        fill={DEVICE.chassis2}
      />
      <rect
        x={650}
        y={15}
        width={145}
        height={160}
        rx={8}
        fill={DEVICE.chassis2}
      />

      <Hotspot {...hs("power")} x={20} y={33} w={44} h={44}>
        <circle
          cx={42}
          cy={55}
          r={14}
          fill="#111"
          stroke="#6bb6ff"
          strokeWidth={2.5}
        />
        <path
          d="M42 47v8M36 51a8 8 0 1 0 12 0"
          stroke="#cfe6ff"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </Hotspot>

      <Hotspot {...hs("health")} x={24} y={84} w={36} h={50}>
        <rect x={30} y={88} width={24} height={42} rx={4} fill="#111" />
        <circle cx={42} cy={99} r={4} fill={DEVICE.ledBlue} />
        <circle cx={42} cy={110} r={4} fill={DEVICE.ledOff} />
        <circle cx={42} cy={121} r={4} fill={DEVICE.ledOff} />
      </Hotspot>

      <Hotspot {...hs("tag")} x={17} y={138} w={50} h={28}>
        <rect x={20} y={141} width={44} height={22} rx={3} fill="#d9dde2" />
        <text
          x={42}
          y={156}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill={DEVICE.chassis}
        >
          TAG
        </text>
      </Hotspot>

      <Hotspot {...hs("drives")} x={88} y={22} w={560} h={146}>
        {Array.from({ length: 8 }, (_, i) => {
          const x = 92 + (i % 4) * 139;
          const y = 26 + Math.floor(i / 4) * 72;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={133}
                height={66}
                rx={5}
                fill={DEVICE.bay}
                stroke={DEVICE.edge}
              />
              <circle cx={x + 14} cy={y + 16} r={3.5} fill={DEVICE.ledGreen} />
              <circle
                cx={x + 14}
                cy={y + 30}
                r={3.5}
                fill={i === amberBay ? DEVICE.ledAmber : DEVICE.ledOff}
              />
              <Label x={x + 28} y={y + 21}>{`Bay ${i}`}</Label>
              {Array.from({ length: 5 }, (_, g) => (
                <rect
                  key={g}
                  x={x + 60 + g * 12}
                  y={y + 44}
                  width={7}
                  height={12}
                  rx={1.5}
                  fill="#2c3238"
                />
              ))}
            </g>
          );
        })}
      </Hotspot>

      <Hotspot {...hs("frontio")} x={664} y={30} w={112} h={36}>
        <rect
          x={672}
          y={40}
          width={30}
          height={14}
          rx={2}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <rect
          x={714}
          y={37}
          width={52}
          height={20}
          rx={4}
          fill="#24476b"
          stroke={DEVICE.portStroke}
        />
        <Label x={672} y={78}>
          USB · VGA
        </Label>
      </Hotspot>

      <Hotspot {...hs("idracdirect")} x={664} y={96} w={74} h={36}>
        <rect
          x={672}
          y={104}
          width={24}
          height={12}
          rx={3}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <Label x={702} y={114}>
          iDRAC
        </Label>
        <Label x={672} y={130}>
          Direct
        </Label>
      </Hotspot>

      <text
        x={44}
        y={187}
        textAnchor="middle"
        className="fill-muted-foreground text-[11px] font-semibold"
      >
        kiri
      </text>
      <text
        x={722}
        y={187}
        textAnchor="middle"
        className="fill-muted-foreground text-[11px] font-semibold"
      >
        kanan
      </text>
    </>
  );
}

function RearView({ selected, onPick }: Omit<ServerSvgProps, "view">) {
  const hs = (id: PartId) => ({
    label: PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  const psu = (id: PartId, x: number, label: string) => (
    <Hotspot {...hs(id)} x={x - 4} y={24} w={158} h={140}>
      <rect
        x={x}
        y={28}
        width={150}
        height={132}
        rx={5}
        fill="#464d56"
        stroke="#5b636d"
      />
      {Array.from({ length: 6 }, (_, r) => (
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
      <rect
        x={x + 118}
        y={44}
        width={20}
        height={74}
        rx={4}
        fill={DEVICE.chassis}
      />
      <circle cx={x + 128} cy={138} r={5} fill={DEVICE.ledGreen} />
      <Label x={x + 14} y={146}>
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
        height={160}
        rx={8}
        fill={DEVICE.chassis}
      />

      <Hotspot {...hs("rearports")} x={16} y={30} w={100} h={62}>
        <rect
          x={24}
          y={38}
          width={46}
          height={18}
          rx={4}
          fill="#24476b"
          stroke={DEVICE.portStroke}
        />
        <rect
          x={24}
          y={64}
          width={46}
          height={18}
          rx={4}
          fill="#3b3f45"
          stroke={DEVICE.portStroke}
        />
        <rect
          x={80}
          y={38}
          width={26}
          height={12}
          rx={2}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
        <rect
          x={80}
          y={56}
          width={26}
          height={12}
          rx={2}
          fill="#111"
          stroke={DEVICE.portStroke}
        />
      </Hotspot>

      <Hotspot {...hs("sysid")} x={22} y={102} w={38} h={38}>
        <circle cx={41} cy={121} r={11} fill="#2d6cdf" />
        <text
          x={41}
          y={125}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill="#fff"
        >
          ID
        </text>
      </Hotspot>

      <Hotspot {...hs("idrac")} x={64} y={102} w={48} h={56}>
        <rect
          x={72}
          y={110}
          width={32}
          height={26}
          rx={3}
          fill="#111"
          stroke="#b8c0c9"
        />
        <Label x={88} y={152} anchor="middle">
          iDRAC
        </Label>
      </Hotspot>

      <Hotspot {...hs("pcie")} x={124} y={22} w={312} h={86}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x={130}
              y={28 + i * 28}
              width={300}
              height={22}
              rx={3}
              fill={DEVICE.bay}
              stroke={DEVICE.edge}
            />
            <Label x={140} y={43 + i * 28}>{`PCIe slot ${i + 1}`}</Label>
          </g>
        ))}
      </Hotspot>

      <Hotspot {...hs("nic")} x={124} y={112} w={312} h={56}>
        <rect
          x={130}
          y={118}
          width={300}
          height={44}
          rx={4}
          fill="#20252b"
          stroke={DEVICE.edge}
        />
        {[0, 1, 2, 3].map((k) => {
          const x = 146 + k * 68;
          return (
            <g key={k}>
              <rect
                x={x}
                y={126}
                width={40}
                height={28}
                rx={2}
                fill="#111"
                stroke={DEVICE.portStroke}
              />
              <circle cx={x + 8} cy={131} r={2.5} fill={DEVICE.ledGreen} />
              <circle cx={x + 32} cy={131} r={2.5} fill={DEVICE.ledAmber} />
            </g>
          );
        })}
      </Hotspot>

      {psu("psu1", 462, "PSU 1")}
      {psu("psu2", 632, "PSU 2")}
    </>
  );
}

export default function ServerSvg({
  view,
  selected,
  onPick,
  amberBay,
}: ServerSvgProps) {
  return (
    <svg
      viewBox="0 0 800 190"
      role="group"
      aria-label={
        view === "front" ? "Tampak depan server" : "Tampak belakang server"
      }
      className="block h-auto w-full min-w-[560px] font-sans"
    >
      {view === "front" ? (
        <FrontView selected={selected} onPick={onPick} amberBay={amberBay} />
      ) : (
        <RearView selected={selected} onPick={onPick} />
      )}
    </svg>
  );
}
