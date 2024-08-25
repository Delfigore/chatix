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
    <div className={cn("bg-gray-50 rounded-lg p-4")}>
      <h2 className={cn("text-xl font-bold mb-4")}>Trending</h2>
      <ul>
        {memoizedTopics.map((topic) => (
          <li key={topic.id} className={cn("mb-3")}>
            <a href="#" className={cn("block hover:bg-gray-100 p-2 rounded")}>
              <div className={cn("font-semibold")}>{topic.name}</div>
              <div className={cn("text-sm text-gray-500")}>{topic.tweets} Tweets</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(TrendingSection);