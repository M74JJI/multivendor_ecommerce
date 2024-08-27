const OfferIcon = () => {
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
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path
            fill="url(#boxGradient)"
            d="m21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58c.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4S7 4.67 7 5.5S6.33 7 5.5 7z"
          />
        </g>
      </svg>
    </svg>
  );
};

export default OfferIcon;
