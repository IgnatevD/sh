// Original illustrated mascot: a girl mountain guide in alpine gear (helmet, harness, rope, ice axe)
// pointing with her hand. Fully vector, animated with CSS.
export default function GuideGirl({ pointing = true, className = '' }) {
  return (
    <svg className={`girl ${pointing ? 'girl--pointing' : ''} ${className}`} viewBox="0 0 150 210" aria-hidden="true">
      <ellipse cx="72" cy="203" rx="40" ry="5" className="girl__shadow" />
      <g className="girl__body">
        {/* braid behind */}
        <path className="girl__hair" d="M88 60 C 100 80, 96 100, 104 118 C 106 124, 98 128, 95 120 C 90 104, 92 84, 84 70Z" />
        <circle cx="101" cy="122" r="4" className="girl__tie" />
        {/* backpack */}
        <rect x="40" y="82" width="64" height="62" rx="16" className="girl__pack" />
        {/* legs */}
        <path className="girl__pants" d="M52 138 h16 l-1 44 h-13z M76 138 h16 l-2 44 h-13z" />
        {/* boots */}
        <path className="girl__boot" d="M50 180 h19 v8 a3 3 0 0 1-3 3 h-20 a4 4 0 0 1 4-6z M75 180 h18 l2 6 a4 4 0 0 1 4 5 h-21 a3 3 0 0 1-3-3z" />
        {/* torso / jacket */}
        <path className="girl__jacket" d="M48 88 C 52 80, 92 80, 96 88 L 98 140 C 98 146, 46 146, 46 140 Z" />
        <path className="girl__zip" d="M72 86 V142" />
        <path className="girl__collar" d="M58 84 L72 94 L86 84" />
        {/* rope coil across shoulder */}
        <path className="girl__rope" d="M54 86 C 70 104, 86 122, 94 136" />
        <path className="girl__rope girl__rope--b" d="M58 84 C 74 102, 88 118, 97 130" />
        {/* harness */}
        <rect x="46" y="132" width="52" height="8" rx="3" className="girl__harness" />
        <circle cx="72" cy="140" r="4" className="girl__biner" />
        {/* left arm holding ice axe */}
        <path className="girl__sleeve" d="M50 90 C 40 100, 36 116, 38 128 l9 -1 C 46 116, 50 104, 56 96Z" />
        <circle cx="42" cy="129" r="5.5" className="girl__skin" />
        <g className="girl__axe">
          <path d="M42 108 L38 194" className="girl__shaft" />
          <path d="M30 108 C 36 104, 46 104, 54 110 L 52 112 C 46 108, 38 108, 32 112Z" className="girl__axehead" />
        </g>
        {/* head */}
        <rect x="66" y="74" width="12" height="10" rx="4" className="girl__skin" />
        <circle cx="72" cy="58" r="22" className="girl__skin" />
        <path className="girl__hair" d="M51 56 C 52 66, 56 68, 60 60 C 66 64, 80 62, 88 56 C 92 64, 94 62, 93 54Z" />
        {/* helmet */}
        <path className="girl__helmet" d="M48 54 C 48 30, 96 30, 96 54 L 97 57 L 47 57 Z" />
        <path className="girl__helmet-vent" d="M62 40 l3 9 M72 37 v10 M82 40 l-3 9" />
        <rect x="66" y="47" width="12" height="7" rx="2" className="girl__lamp" />
        <circle cx="72" cy="50.5" r="2" className="girl__lamp-glow" />
        <path className="girl__strap" d="M50 57 C 52 70, 60 78, 72 80 C 84 78, 92 70, 94 57" />
        {/* face */}
        <g className="girl__eyes">
          <ellipse cx="64" cy="63" rx="2.4" ry="3" />
          <ellipse cx="80" cy="63" rx="2.4" ry="3" />
        </g>
        <circle cx="58" cy="70" r="3.4" className="girl__blush" />
        <circle cx="86" cy="70" r="3.4" className="girl__blush" />
        <path className="girl__smile" d="M66 71 C 69 75, 75 75, 78 71" />
        {/* right arm pointing */}
        <g className="girl__point">
          <path className="girl__sleeve" d="M92 90 C 104 84, 116 74, 124 64 l7 6 C 122 82, 108 94, 96 100Z" />
          <circle cx="128" cy="66" r="5.5" className="girl__skin" />
          <path className="girl__finger" d="M130 63 L139 54" />
        </g>
      </g>
    </svg>
  );
}
