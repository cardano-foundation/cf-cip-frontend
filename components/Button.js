const Button = ({ type = 'button', className, ...props }) => (
    <button
        type={type}
        className={`${className} inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-[.625rem] text-xl font-semibold hover:bg-cardano-700 active:bg-cardano-900 focus:outline-none focus:border-cardano-900 focus:ring ring-cf-blue-300 disabled:opacity-25 transition ease-in-out duration-150`}
        {...props}
    />
  )
  
  export default Button
  