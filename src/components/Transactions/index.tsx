import { useCallback } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      // Send approval status to backend
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      });
    },
    [fetchWithoutCache]
  );

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className="RampMessage--container">No transactions found.</div>;
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  );
};
