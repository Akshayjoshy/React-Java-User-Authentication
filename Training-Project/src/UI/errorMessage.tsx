interface ErrorMessageProps {
  errorMessage: string;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ errorMessage }) => {
  return (
    <span className='text-red-400 text-sm mt-1'>
      {errorMessage}
    </span>
  );
};

export default ErrorMessage;
