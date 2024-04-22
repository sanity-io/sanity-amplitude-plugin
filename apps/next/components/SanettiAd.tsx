import { cx } from 'class-variance-authority'

import localFont from 'next/font/local'

const panchang = localFont({
  src: [
    {
      path: '../fonts/Panchang-Semibold.woff2',
      style: 'normal',
      weight: '600',
    },
    { path: '../fonts/Panchang-Bold.woff2', style: 'normal', weight: '700' },
  ],
  display: 'swap',
})

type AdVariant = 'large-rectangle' | 'half-page' | 'billboard'

export function SanettiAd(props: { variant: AdVariant }) {
  const { variant } = props
  return (
    <div
      className={cx([
        'bg-[--background] [--background:#1F2227] relative text-white overflow-hidden',
        variant === 'large-rectangle' && 'w-[336px] h-[280px] max-w-full',
        variant === 'half-page' && 'w-[300px] h-[600px] max-w-full',
        variant === 'billboard' &&
          'w-[970px] h-[250px] max-w-full [--img-width:550px]',
      ])}
    >
      <div
        className={cx([
          'flex size-full font-light',
          variant === 'half-page' && 'flex-col',
        ])}
      >
        {variant === 'billboard' && (
          <div className="w-[calc(var(--img-width)-6rem)]"></div>
        )}
        {variant !== 'half-page' && (
          <Image
            variant={variant}
            className={cx([
              variant === 'billboard' &&
                'absolute -translate-x-12 -top-[42px] w-[--img-width]',
              variant === 'large-rectangle' &&
                'absolute size-[135%] -top-[40px] translate-x-[95px]',
            ])}
          />
        )}
        <div
          className={cx([
            'relative',
            variant === 'billboard' &&
              'py-8 pr-8 flex flex-col justify-between flex-1',
            variant === 'large-rectangle' &&
              'p-6 justify-between flex flex-col',
            variant === 'half-page' &&
              'py-10 text-center flex flex-col justify-between items-center flex-1',
          ])}
        >
          <div
            className={cx([
              variant === 'half-page'
                ? 'flex flex-col justify-center items-center'
                : 'space-y-3',
            ])}
          >
            <SanettiLogo />
            <h1
              className={cx([
                panchang.className,
                'font-semibold',
                variant === 'billboard' && 'text-3xl',
                variant === 'large-rectangle' && 'text-2xl',
                variant === 'half-page' && 'text-2xl mt-8',
              ])}
            >
              Ride the revolution
            </h1>
            <p
              className={cx([
                variant === 'large-rectangle' && 'text-sm max-w-[100px]',
                variant === 'half-page' && 'mt-6',
              ])}
            >
              Introducing the Sanetti S600
            </p>
          </div>
          {variant === 'half-page' && (
            <Image variant={variant} className={cx(['h-[325px]'])} />
          )}
          <div
            className={cx([
              'flex items-center relative',
              variant !== 'half-page' && 'justify-between',
              variant === 'half-page' && 'flex-col px-8 -mt-12',
            ])}
          >
            {(variant === 'billboard' || variant === 'half-page') && (
              <small
                className={cx([
                  'font-extralight max-w-[300px]',
                  variant === 'half-page' ? 'text-xs' : 'text-[11px]',
                ])}
              >
                The Sanetti S600 is here to redefine your cycling experience.
                Get ready to ride the future.
              </small>
            )}
            <div className={cx([variant === 'half-page' && 'mt-4'])}>
              <button className="inline-flex whitespace-nowrap text-[9px] leading-none [letter-spacing:3px] font-medium bg-white text-[--background] px-6 py-3 rounded-full uppercase">
                Pre-order now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Image(props: { className?: string; variant: AdVariant }) {
  const { variant } = props
  return (
    <>
      <div className={cx([props.className])}>
        <div className="h-full relative">
          <img
            className={cx(['object-cover object-center size-full'])}
            src="/sanetti-ad.jpg"
            alt=""
          />
          {/* Gradient overlay */}
          {variant === 'billboard' && (
            <div className="absolute h-full w-28 right-0 top-0 bg-gradient-to-l from-[--background]" />
          )}
          {variant === 'half-page' && (
            <>
              <div className="absolute h-12 w-full right-0 left-0 top-0 bg-gradient-to-b from-[--background]" />
              <div className="absolute h-12 w-full right-0 left-0 bottom-0 bg-gradient-to-t from-[--background]" />
            </>
          )}
        </div>
      </div>
      {/* Gradient overlay */}
      {variant === 'large-rectangle' && (
        <div className="absolute h-full w-full top-0 left-0 bg-gradient-to-r from-[--background] from-[23%]" />
      )}
    </>
  )
}

function SanettiLogo() {
  return (
    <svg
      width="90"
      height="11"
      viewBox="0 0 90 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.60538 5.2866L5.40951 10.5956C5.52522 10.7986 5.73571 10.9225 5.96215 10.9225H7.07144C7.25598 10.9225 7.43155 10.8402 7.55326 10.6955L16.1791 0.509686C16.3687 0.285833 16.1701 -0.0598378 15.8918 0.00887981L1.61352 3.13067C1.52764 3.14945 1.45711 3.05934 1.49167 2.975L1.6554 2.57544C1.68946 2.49235 1.62139 2.40303 1.53634 2.4192L1.13852 2.49485L0.0821474 3.74997C0.0170716 3.82729 0.0763113 3.94798 0.174317 3.93774L10.7963 2.82839C11.0038 2.80652 11.1285 3.06161 10.9908 3.22507L6.94574 7.99158C6.77915 8.18836 6.48487 8.18732 6.31828 7.99158L4.17466 5.4433C4.04398 5.28816 3.85544 5.19862 3.65793 5.19758L2.60538 5.28764V5.2866Z"
        fill="currentColor"
      />
      <path
        d="M89.9879 0.479004V2.5619H87.744V0.479004H89.9879ZM87.744 10.5463V3.50614H89.9879V10.5463H87.744Z"
        fill="currentColor"
      />
      <path
        d="M86.5492 5.39456H77.4275V3.50607H86.5492V5.39456ZM78.9146 7.18585V3.76991L79.366 1.68701H81.1718V6.94979C81.1718 7.4034 81.2337 7.76444 81.3577 8.0329C81.4904 8.2921 81.7206 8.47725 82.0481 8.58834C82.3756 8.69017 82.8226 8.74108 83.3891 8.74108C84.0176 8.74108 84.593 8.69943 85.1152 8.61611C85.6375 8.53279 86.1376 8.44022 86.6156 8.33839L87.0538 10.213C86.5315 10.3426 85.934 10.4583 85.2613 10.5601C84.5885 10.6712 83.8981 10.7268 83.19 10.7268C82.234 10.7268 81.4373 10.6157 80.8 10.3935C80.1715 10.1621 79.698 9.78716 79.3793 9.26875C79.0695 8.74108 78.9146 8.04678 78.9146 7.18585Z"
        fill="currentColor"
      />
      <path
        d="M76.7238 5.39456H67.6021V3.50607H76.7238V5.39456ZM69.0891 7.18585V3.76991L69.5406 1.68701H71.3463V6.94979C71.3463 7.4034 71.4083 7.76444 71.5322 8.0329C71.665 8.2921 71.8951 8.47725 72.2227 8.58834C72.5502 8.69017 72.9972 8.74108 73.5637 8.74108C74.1922 8.74108 74.7675 8.69943 75.2898 8.61611C75.812 8.53279 76.3122 8.44022 76.7902 8.33839L77.2283 10.213C76.7061 10.3426 76.1086 10.4583 75.4358 10.5601C74.7631 10.6712 74.0727 10.7268 73.3645 10.7268C72.4085 10.7268 71.6119 10.6157 70.9746 10.3935C70.3461 10.1621 69.8725 9.78716 69.5539 9.26875C69.2441 8.74108 69.0891 8.04678 69.0891 7.18585Z"
        fill="currentColor"
      />
      <path
        d="M62.3044 8.86615C62.9682 8.86615 63.5746 8.84764 64.1234 8.81061C64.6811 8.76432 65.1679 8.70878 65.5839 8.64398C66 8.57918 66.3363 8.52826 66.593 8.49123L67.0445 10.1853C66.6373 10.2964 66.1593 10.3936 65.6105 10.4769C65.0617 10.551 64.4819 10.6112 63.8711 10.6574C63.2692 10.7037 62.6806 10.7269 62.1052 10.7269C60.8394 10.7269 59.7993 10.6019 58.985 10.352C58.1795 10.102 57.582 9.70394 57.1925 9.15776C56.803 8.61158 56.6083 7.89877 56.6083 7.01932C56.6083 6.13988 56.8163 5.43169 57.2323 4.89477C57.6484 4.34859 58.2503 3.95052 59.0381 3.70057C59.8347 3.44137 60.7996 3.31177 61.9326 3.31177C62.7292 3.31177 63.4507 3.37194 64.0968 3.49228C64.743 3.60337 65.2963 3.78389 65.7565 4.03384C66.2257 4.28379 66.5842 4.61705 66.832 5.03363C67.0887 5.44095 67.2171 5.94084 67.2171 6.53331C67.2171 6.62589 67.2126 6.74623 67.2038 6.89435C67.1949 7.03321 67.1861 7.16744 67.1772 7.29704C67.1772 7.41739 67.1728 7.50533 67.164 7.56087H57.8298V6.32502H65.3317L65.0396 6.78326C65.0396 6.34817 64.9555 5.99176 64.7873 5.71404C64.6279 5.43632 64.3181 5.23266 63.8578 5.10306C63.4064 4.97346 62.7381 4.90865 61.8529 4.90865C61.0828 4.90865 60.4676 4.97346 60.0073 5.10306C59.5559 5.2234 59.2372 5.43169 59.0514 5.72793C58.8655 6.0149 58.7725 6.41297 58.7725 6.92212C58.7725 7.32944 58.8256 7.6627 58.9319 7.92191C59.0469 8.17186 59.2372 8.36626 59.5028 8.50512C59.7772 8.64398 60.1401 8.74118 60.5916 8.79672C61.0518 8.84301 61.6228 8.86615 62.3044 8.86615Z"
        fill="currentColor"
      />
      <path
        d="M55.7414 6.65829V10.5464H53.4975V7.03321C53.4975 6.6444 53.4134 6.32039 53.2452 6.06119C53.0858 5.80198 52.838 5.60758 52.5016 5.47798C52.1653 5.34838 51.7404 5.28357 51.227 5.28357C50.4569 5.28357 49.5717 5.40855 48.5715 5.6585C47.5712 5.89919 46.4957 6.23245 45.345 6.65829V5.31135C45.7345 5.08917 46.1771 4.86237 46.6728 4.63093C47.1685 4.3995 47.6996 4.18658 48.2661 3.99218C48.8414 3.78852 49.4389 3.62652 50.0586 3.50617C50.6782 3.37657 51.3111 3.31177 51.9573 3.31177C52.7628 3.31177 53.4443 3.42748 54.002 3.65892C54.5685 3.89035 54.9978 4.25138 55.2899 4.74202C55.5909 5.2234 55.7414 5.86216 55.7414 6.65829ZM45.1326 10.5464V3.50617H47.1109L47.3765 5.14471V10.5464H45.1326Z"
        fill="currentColor"
      />
      <path
        d="M41.6755 4.00594L43.9327 3.82542V10.5462H41.9543L41.6755 8.94935V4.00594ZM43.9327 3.82542L42.99 5.6306C42.5739 5.5658 42.0827 5.50563 41.5162 5.45008C40.9585 5.39454 40.3743 5.34825 39.7635 5.31122C39.1616 5.27419 38.5862 5.25568 38.0374 5.25568C37.4709 5.25568 36.9929 5.31585 36.6034 5.4362C36.214 5.54728 35.9174 5.73243 35.7138 5.99164C35.5103 6.24158 35.4085 6.57947 35.4085 7.00531C35.4085 7.63481 35.5766 8.08379 35.913 8.35225C36.2582 8.61145 36.8203 8.74106 37.5993 8.74106C38.21 8.74106 38.8518 8.67626 39.5245 8.54665C40.2061 8.40779 40.9054 8.22265 41.6224 7.99121C42.3394 7.75052 43.0608 7.48206 43.7866 7.18583V8.49111C43.3972 8.72254 42.9546 8.96786 42.4589 9.22707C41.9632 9.47701 41.4276 9.71307 40.8523 9.93525C40.2858 10.1574 39.6927 10.3379 39.0731 10.4768C38.4535 10.6157 37.8161 10.6851 37.1611 10.6851C36.3556 10.6851 35.6519 10.5647 35.05 10.3241C34.4569 10.0834 33.9922 9.69919 33.6558 9.17152C33.3283 8.64386 33.1646 7.94956 33.1646 7.08863C33.1646 6.13512 33.377 5.38991 33.8019 4.85299C34.2356 4.31606 34.8331 3.93651 35.5944 3.71434C36.3645 3.4829 37.2541 3.36719 38.2631 3.36719C39.3962 3.36719 40.4407 3.4181 41.3967 3.51993C42.3527 3.61251 43.198 3.71434 43.9327 3.82542Z"
        fill="currentColor"
      />
      <path
        d="M32.3709 7.89407C32.3709 8.3847 32.2779 8.81054 32.092 9.17157C31.9061 9.53261 31.5963 9.82884 31.1626 10.0603C30.7377 10.2825 30.1535 10.4491 29.41 10.5602C28.6753 10.6713 27.7503 10.7268 26.6349 10.7268C25.9002 10.7268 25.139 10.6898 24.3512 10.6157C23.5722 10.5509 22.8243 10.4676 22.1073 10.3658C21.3903 10.2547 20.7618 10.1297 20.2219 9.99085L20.5671 7.96349C21.0185 8.06533 21.5009 8.16253 22.0143 8.2551C22.5277 8.34767 23.0677 8.43099 23.6342 8.50505C24.2007 8.57911 24.7849 8.63928 25.3868 8.68556C25.9976 8.72259 26.6217 8.74111 27.259 8.74111C27.8609 8.74111 28.3433 8.72722 28.7062 8.69945C29.078 8.66242 29.3613 8.61151 29.556 8.54671C29.7596 8.47265 29.8968 8.37545 29.9676 8.2551C30.0473 8.13476 30.0871 7.99127 30.0871 7.82464C30.0871 7.58395 30.0429 7.40806 29.9543 7.29697C29.8658 7.18588 29.7286 7.10719 29.5427 7.06091C29.3657 7.00536 29.14 6.96833 28.8656 6.94982L23.8201 6.60267C22.9261 6.54713 22.2046 6.41289 21.6558 6.19998C21.107 5.98706 20.7043 5.6862 20.4476 5.29739C20.1997 4.89932 20.0758 4.40869 20.0758 3.82548C20.0758 3.13118 20.275 2.57111 20.6733 2.14527C21.0716 1.71944 21.7045 1.40932 22.572 1.21491C23.4395 1.01125 24.5636 0.909424 25.9445 0.909424C26.3605 0.909424 26.8208 0.927938 27.3254 0.964967C27.8299 0.992739 28.3522 1.0344 28.8921 1.08994C29.4409 1.14549 29.9765 1.21492 30.4987 1.29823C31.021 1.38155 31.499 1.47412 31.9327 1.57595L31.5477 3.47833C31.167 3.39501 30.7333 3.32095 30.2464 3.25615C29.7685 3.18209 29.2595 3.12192 28.7195 3.07563C28.1796 3.02009 27.6263 2.97843 27.0598 2.95066C26.5022 2.91363 25.9489 2.89512 25.4001 2.89512C24.7451 2.89512 24.214 2.909 23.8068 2.93677C23.4085 2.96455 23.1031 3.01083 22.8907 3.07563C22.6782 3.14044 22.5366 3.22838 22.4658 3.33947C22.395 3.45056 22.3596 3.59404 22.3596 3.76993C22.3596 3.97359 22.4082 4.13097 22.5056 4.24206C22.603 4.35314 22.749 4.43183 22.9438 4.47812C23.1474 4.51515 23.4041 4.54755 23.7139 4.57532L28.6797 4.92247C29.2993 4.9595 29.8393 5.04744 30.2996 5.1863C30.7687 5.3159 31.1538 5.50105 31.4547 5.74174C31.7645 5.97317 31.9947 6.26941 32.1451 6.63044C32.2956 6.98222 32.3709 7.40343 32.3709 7.89407Z"
        fill="currentColor"
      />
    </svg>
  )
}
