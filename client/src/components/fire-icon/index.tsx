const FireIcon = ({
  fillPercentage,
  color,
  size,
}: {
  fillPercentage: number;
  color: string;
  size: number | string;
}) => {
  return (
    <div className='fire-icon-container'>
      <svg
        width={size}
        height={size}
        viewBox='0 0 465.348 465.349'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='fire-icon'>
        <defs>
          <clipPath id='clip-path'>
            <rect x='0' y={`${100 - fillPercentage}%`} width='100%' height='100%' />
          </clipPath>
        </defs>
        <g>
          <path
            d='M360.08,384.767c-8.825,28.999-32.179,52.7-69.393,70.463c-12.419,6.514-30.311,10.119-50.342,10.119
                c-46.299,0-88.735-18.146-113.514-48.546c-24.671-30.263-31.954-71.006-21.645-121.1c14.201-56.602,58.233-105.953,100.805-153.691
                c0,0,89.247-77.558,100.093-142.012c4.912,26.879,13.234,72.655-37.74,134.508c-83.486,95.436-69.856,147.193-63.694,160.788
                c5.695,12.536,16.316,20.043,28.416,20.055h0.006c2.79,0,5.63-0.401,8.443-1.182c29.495-11.786,25.28-39.992,20.398-72.644
                c-4.221-28.221-8.996-60.207,8.388-86.38l1.383-2.096v2.519c-0.048,37.829,15.001,52.653,32.426,69.817
                c9.54,9.413,18.294,19.828,27.739,33.529C364.175,305.811,370.506,350.508,360.08,384.767z'
            fill={color}
            clipPath='url(#clip-path)'
          />
          <path
            d='M360.08,384.767c-8.825,28.999-32.179,52.7-69.393,70.463c-12.419,6.514-30.311,10.119-50.342,10.119
                c-46.299,0-88.735-18.146-113.514-48.546c-24.671-30.263-31.954-71.006-21.645-121.1c14.201-56.602,58.233-105.953,100.805-153.691
                c0,0,89.247-77.558,100.093-142.012c4.912,26.879,13.234,72.655-37.74,134.508c-83.486,95.436-69.856,147.193-63.694,160.788
                c5.695,12.536,16.316,20.043,28.416,20.055h0.006c2.79,0,5.63-0.401,8.443-1.182c29.495-11.786,25.28-39.992,20.398-72.644
                c-4.221-28.221-8.996-60.207,8.388-86.38l1.383-2.096v2.519c-0.048,37.829,15.001,52.653,32.426,69.817
                c9.54,9.413,18.294,19.828,27.739,33.529C364.175,305.811,370.506,350.508,360.08,384.767z'
            fill='none'
            stroke={color}
            strokeWidth='2'
          />
        </g>
      </svg>
    </div>
  );
};

export default FireIcon;