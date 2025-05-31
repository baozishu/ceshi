import FriendLinkCard from './FriendLinkCard';
import friendLinksData from '../data/friendLinks.json';

const FriendLinksSection = () => {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">合作伙伴</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {friendLinksData.links.map((link, index) => (
          <FriendLinkCard key={index} link={link} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-6 text-center">
        以上链接均为合作伙伴网站，点击将在新窗口打开
      </p>
    </div>
  );
};

export default FriendLinksSection;
