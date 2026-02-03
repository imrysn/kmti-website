import { useState, useEffect } from 'react';

export type VisitCounts = {
  total: number;
  today: number;
  yesterday: number;
};

export const useVisitCounter = () => {
  const [visitCounts, setVisitCounts] = useState<VisitCounts>({
    total: 0,
    today: 0,
    yesterday: 0,
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      return;
    }

    fetch('/visit_counter.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setVisitCounts({
          total: data.total,
          today: data.today,
          yesterday: data.yesterday
        });
      })
      .catch(() => {
        // Silently fail
      });
  }, []);

  return visitCounts;
};
