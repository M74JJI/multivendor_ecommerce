const CategoriesIcon = () => {
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
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path
            fill="url(#boxGradient)"
            d="M29 10h-5v2h5v6h-7v2h3v2.142a4 4 0 1 0 2 0V20h2a2.003 2.003 0 0 0 2-2v-6a2.002 2.002 0 0 0-2-2zm-1 16a2 2 0 1 1-2-2a2.003 2.003 0 0 1 2 2zM19 6h-5v2h5v6h-7v2h3v6.142a4 4 0 1 0 2 0V16h2a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2zm-1 20a2 2 0 1 1-2-2a2.003 2.003 0 0 1 2 2zM9 2H3a2.002 2.002 0 0 0-2 2v6a2.002 2.002 0 0 0 2 2h2v10.142a4 4 0 1 0 2 0V12h2a2.002 2.002 0 0 0 2-2V4a2.002 2.002 0 0 0-2-2zM8 26a2 2 0 1 1-2-2a2.002 2.002 0 0 1 2 2zM3 10V4h6l.002 6z"
          />
        </g>
      </svg>
    </svg>
  );
};

export default CategoriesIcon;
