import { Loader2Icon } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-center justify-center p-16">
      <Loader2Icon className="animate-spin w-8 h-8 mx-auto" />
    </div>
  );
};

export default LoadingIndicator;
