type Props = {
    status: "pending" | "in_progress" | "completed";
  };
  
  export default function StatusBadge({ status }: Props) {
  
    if (status === "pending") {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
          Pending
        </span>
      );
    }
  
    if (status === "in_progress") {
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
          In Progress
        </span>
      );
    }
  
    if (status === "completed") {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
          Completed
        </span>
      );
    }
  
    return null;
  }