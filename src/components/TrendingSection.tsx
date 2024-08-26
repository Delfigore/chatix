import React, { useMemo } from 'react';
import { cn } from '../lib/utils';

interface TrendingTopic {
  id: number;
  name: string;
  tweets: string;
}

interface TrendingSectionProps {
  trendingTopics?: TrendingTopic[];
}

const defaultTrendingTopics: TrendingTopic[] = [
  { id: 1, name: "Twitter Clone", tweets: "10K" },
  { id: 2, name: "React", tweets: "5K" },
  { id: 3, name: "NextJS", tweets: "3K" },
];

const TrendingSection: React.FC<TrendingSectionProps> = ({ trendingTopics = defaultTrendingTopics }) => {
  const memoizedTopics = useMemo(() => trendingTopics, [trendingTopics]);

  return (
    <section className={cn("bg-gray-50 rounded-lg p-4")} aria-labelledby="trending-section-title">
      <h2 id="trending-section-title" className={cn("text-xl font-bold mb-4")}>Trending</h2>
      <ul className="space-y-2">
        {memoizedTopics.map((topic) => (
          <li key={topic.id}>
            <a 
              href="#" 
              className={cn(
                "block hover:bg-gray-100 p-2 rounded transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            >
              <div className={cn("font-semibold")}>{topic.name}</div>
              <div className={cn("text-sm text-gray-500")}>{topic.tweets} Tweets</div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default React.memo(TrendingSection);