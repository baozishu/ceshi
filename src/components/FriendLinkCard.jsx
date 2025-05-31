import { ExternalLink } from 'lucide-react';

const FriendLinkCard = ({ link }) => {
  return (
    <a
      href={link.url}
      target="_blank"
      rel={`noopener noreferrer ${link.follow ? '' : 'nofollow'}`}
      className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-md bg-white w-full max-w-xs"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border border-gray-200">
        <img 
          src={link.icon} 
          alt={link.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200 mb-1">
        {link.name}
      </h4>
      <div className="flex items-center text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
        <span>访问网站</span>
        <ExternalLink className="w-4 h-4 ml-1" />
      </div>
    </a>
  );
};

export default FriendLinkCard;
