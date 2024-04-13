import React from 'react';

export const Loading = ({ className }: React.SVGAttributes<any>) => {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} animate-spin`}
    >
      <path
        d="M350 200C350 117.157 282.843 50 200 50"
        stroke="currentColor"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const Loading2 = ({ style, className }: React.SVGAttributes<any>) => {
  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      <path
        d="M316.62 105.68C289.12 121.14 247.09 129.29 200 129.29C152.9 129.29 110.87 121.14 83.3701 105.68"
        stroke="#6A0BFF"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M316.62 294.32C289.12 278.86 247.09 270.71 200 270.71C152.9 270.71 110.87 278.86 83.3701 294.32"
        stroke="#6A0BFF"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M50 200H350"
        stroke="#6A0BFF"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M200 350C154.12 350 116.93 282.84 116.93 200C116.93 117.16 154.12 50 200 50"
        stroke="#6A0BFF"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M200 50V350"
        stroke="#6A0BFF"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M200 50C245.88 50 283.07 117.16 283.07 200C283.07 282.84 245.88 350 200 350"
        stroke="#6A0BFF"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M200 350C117.16 350 50 282.84 50 200C50 117.16 117.16 50 200 50"
        stroke="#191919"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M200 50C282.84 50 350 117.16 350 200C350 282.84 282.84 350 200 350"
        stroke="#191919"
        strokeWidth="12"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
