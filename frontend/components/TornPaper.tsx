interface TornPaperProps {
  /** "cream" fills the wave with cream; omit for cream default */
  fill?: string;
  /** Flip the SVG vertically */
  flip?: boolean;
}

export default function TornPaper({
  fill = "#F8EEE7",
  flip = false,
}: TornPaperProps) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: 60,
        marginTop: -2,
        transform: flip ? "scaleY(-1)" : "none",
      }}
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <path
          d="M0,0 L0,30 C40,45 80,20 120,38 C160,55 200,25 240,40 C280,55 320,30 360,42 C400,54 440,28 480,38 C520,48 560,22 600,35 C640,48 680,26 720,40 C760,54 800,24 840,36 C880,48 920,20 960,33 C1000,46 1040,25 1080,38 C1120,51 1160,28 1200,42 C1240,56 1280,30 1320,44 C1360,58 1400,32 1440,46 L1440,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
