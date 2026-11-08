"use client";

import {
  DEVICE,
  Hotspot,
  SvgLabel as Label,
} from "../../../components/device/Hotspot";
import { NETAPP_PARTS, type NetappPartId } from "../data/parts";

/** Ilustrasi umum controller HA (2 node dalam satu chassis) dan disk shelf 24 bay. */

interface NetappSvgProps {
  view: "controller" | "shelf";
  selected: NetappPartId;
  onPick: (id: NetappPartId) => void;
}

const ROWS = [18, 102];

function Controller({ selected, onPick }: Omit<NetappSvgProps, "view">) {
  const hs = (id: NetappPartId) => ({
    label: NETAPP_PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  const portCol = (
    id: NetappPartId,
    x: number,
    w: number,
    ports: number[],
    pw: number,
    fill: string,
    label: string,
  ) => (
    <Hotspot {...hs(id)} x={x} y={20} w={w} h={160}>
      {ROWS.map((ry) => (
        <g key={ry}>
          {ports.map((px) => (
            <rect
              key={px}
              x={px}
              y={ry + 22}
              width={pw}
              height={18}
              rx={2}
              fill={fill}
              stroke={DEVICE.portStroke}
            />
          ))}
          <Label x={ports[0]} y={ry + 60}>
            {label}
          </Label>
        </g>
      ))}
    </Hotspot>
  );
  return (
    <>
      <rect
        x={5}
        y={12}
        width={580}
        height={176}
        rx={6}
        fill={DEVICE.chassis}
      />
      <rect
        x={10}
        y={ROWS[0]}
        width={570}
        height={80}
        rx={4}
        fill={DEVICE.chassis2}
      />
      <rect
        x={10}
        y={ROWS[1]}
        width={570}
        height={80}
        rx={4}
        fill={DEVICE.chassis2}
      />

      {(["ctrlA", "ctrlB"] as const).map((id, i) => (
        <Hotspot key={id} {...hs(id)} x={12} y={ROWS[i] + 2} w={88} h={76}>
          <rect
            x={16}
            y={ROWS[i] + 6}
            width={80}
            height={68}
            rx={4}
            fill="#464d56"
          />
          <circle cx={30} cy={ROWS[i] + 22} r={4} fill={DEVICE.ledGreen} />
          <Label x={26} y={ROWS[i] + 60}>
            {i === 0 ? "NODE 01" : "NODE 02"}
          </Label>
        </Hotspot>
      ))}

      {portCol("console", 108, 54, [116], 26, "#24476b", "CON")}
      {portCol("e0m", 170, 54, [178], 26, "#111", "e0M")}
      {portCol("cluster", 232, 104, [240, 284], 36, "#111", "e0a e0b")}
      {portCol("data", 344, 104, [352, 396], 36, "#111", "e0c e0d")}
      {portCol("storage", 456, 118, [464, 514], 42, "#464d56", "0a 0b")}

      <rect
        x={592}
        y={12}
        width={203}
        height={176}
        rx={6}
        fill={DEVICE.chassis}
      />
      <Hotspot {...hs("psu")} x={597} y={14} w={196} h={172}>
        {[20, 104].map((y, i) => (
          <g key={y}>
            <rect
              x={603}
              y={y}
              width={184}
              height={76}
              rx={4}
              fill="#464d56"
              stroke="#5b636d"
            />
            {Array.from({ length: 3 }, (_, r) => (
              <line
                key={r}
                x1={617}
                y1={y + 16 + r * 14}
                x2={720}
                y2={y + 16 + r * 14}
                stroke="#353b42"
                strokeWidth={5}
                strokeLinecap="round"
              />
            ))}
            <circle cx={765} cy={y + 20} r={5} fill={DEVICE.ledGreen} />
            <Label x={617} y={y + 66}>{`PSU ${i + 1}`}</Label>
          </g>
        ))}
      </Hotspot>
    </>
  );
}

function Shelf({ selected, onPick }: Omit<NetappSvgProps, "view">) {
  const hs = (id: NetappPartId) => ({
    label: NETAPP_PARTS[id].name,
    selected: selected === id,
    onPick: () => onPick(id),
  });
  return (
    <>
      <rect
        x={5}
        y={12}
        width={790}
        height={176}
        rx={6}
        fill={DEVICE.chassis}
      />
      <rect
        x={10}
        y={18}
        width={80}
        height={164}
        rx={4}
        fill={DEVICE.chassis2}
      />

      <Hotspot {...hs("shelfid")} x={14} y={24} w={72} h={60}>
        <rect
          x={24}
          y={32}
          width={52}
          height={36}
          rx={3}
          fill="#0b0f14"
          stroke={DEVICE.edge}
        />
        <text
          x={50}
          y={58}
          textAnchor="middle"
          fontSize={22}
          fontFamily="monospace"
          fill={DEVICE.ledGreen}
        >
          00
        </text>
      </Hotspot>

      <Hotspot {...hs("shelfled")} x={14} y={96} w={72} h={80}>
        <circle cx={30} cy={116} r={5} fill={DEVICE.ledGreen} />
        <Label x={42} y={120}>
          PWR
        </Label>
        <circle cx={30} cy={142} r={5} fill={DEVICE.ledOff} />
        <Label x={42} y={146}>
          FLT
        </Label>
      </Hotspot>

      <Hotspot {...hs("drives")} x={96} y={18} w={694} h={164}>
        {Array.from({ length: 24 }, (_, i) => {
          const x = 102 + i * 28;
          return (
            <g key={i}>
              <rect
                x={x}
                y={24}
                width={24}
                height={152}
                rx={3}
                fill={DEVICE.bay}
                stroke={DEVICE.edge}
              />
              <circle cx={x + 12} cy={38} r={3} fill={DEVICE.ledGreen} />
              <circle cx={x + 12} cy={50} r={3} fill={DEVICE.ledOff} />
              {i % 4 === 0 && (
                <text
                  x={x + 12}
                  y={168}
                  textAnchor="middle"
                  className="pointer-events-none fill-[#b8c0c9] text-[10px] font-semibold"
                >
                  {i}
                </text>
              )}
            </g>
          );
        })}
      </Hotspot>
    </>
  );
}

export default function NetappSvg({ view, selected, onPick }: NetappSvgProps) {
  return (
    <svg
      viewBox="0 0 800 200"
      role="group"
      aria-label={
        view === "controller"
          ? "Tampak belakang controller"
          : "Tampak depan disk shelf"
      }
      className="block h-auto w-full min-w-[560px] font-sans"
    >
      {view === "controller" ? (
        <Controller selected={selected} onPick={onPick} />
      ) : (
        <Shelf selected={selected} onPick={onPick} />
      )}
    </svg>
  );
}
