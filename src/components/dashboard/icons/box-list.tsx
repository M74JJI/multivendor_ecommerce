const BoxListIcon = () => {
  return (
    <svg
      width={50}
      height={50}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      <defs>
        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4275E4" />
          <stop offset="100%" stopColor="#A1BCF4" />
        </linearGradient>
      </defs>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 2048 2048"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path
            fill="url(#boxGradient)"
            d="M1024 1000v959l-64 32l-832-415V536l832-416l832 416v744h-128V680l-640 320zm-64-736L719 384l621 314l245-122l-625-312zm-64 1552v-816L256 680v816l640 320zM335 576l625 312l238-118l-622-314l-241 120zm1073 1216v-128h640v128h-640zm0-384h640v128h-640v-128zm-256 640v-128h128v128h-128zm0-512v-128h128v128h-128zm0 256v-128h128v128h-128zm-128 24h1h-1zm384 232v-128h640v128h-640z"
          />
        </g>
      </svg>
    </svg>
  );
};

export default BoxListIcon;
