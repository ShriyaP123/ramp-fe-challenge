import { useState } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved);
  const [isProcessing, setIsProcessing] = useState(false); // Added a processing state

  const handleApprovalChange = async (newValue: boolean) => {
    setIsProcessing(true); // Show loading spinner
    try {
      // Update the approval status in the backend
      await consumerSetTransactionApproval({
        transactionId: transaction.id,
        newValue,
      });

      // Update the local state for immediate feedback
      setApproved(newValue);
    } catch (error) {
      console.error("Failed to update transaction approval:", error);
    } finally {
      setIsProcessing(false); // Hide loading spinner after processing
    }
  };

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant}</p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading || isProcessing} // Disable checkbox while processing
        onChange={handleApprovalChange}
      />
      {isProcessing && <span className="loading-spinner">⏳</span>} {/* Add a spinner */}
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
