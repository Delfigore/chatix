import React from 'react';

const TrendingSection: React.FC = () => {
  const trendingTopics = [
    { name: '#ChatixLaunch', posts: '97K' },
    { name: '#TechNews', posts: '80K' },
    { name: '#WebDev', posts: '64K' },
    { name: '#AI', posts: '55K' },
    { name: '#Innovation', posts: '42K' },
  ];

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Trending</h2>
      <ul>
        {trendingTopics.map((topic, index) => {
          if (!topic) throw new Error('Trending topic is null or undefined');
          if (!topic.name) throw new Error('Trending topic name is null or undefined');
          if (!topic.posts) throw new Error('Trending topic posts is null or undefined');

          return (
            <li key={index} className="mb-3">
              <a href="#" className="hover:underline">
                <div className="font-bold">{topic.name}</div>
                <div className="text-sm text-gray-500">{topic.posts} posts</div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrendingSection;