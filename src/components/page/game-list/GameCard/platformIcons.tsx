import { SiPlaystation, SiApple, SiAndroid } from 'react-icons/si';
import { AiFillAppstore } from 'react-icons/ai';
import { FaXbox } from 'react-icons/fa';
import { BsNintendoSwitch } from 'react-icons/bs';

export const getPlatformIcon = (platform: string | { name?: string; title?: string; platform_name?: string }) => {
  let platformName: string;
  if (typeof platform === 'string') {
    platformName = platform;
  } else if (platform && typeof platform === 'object') {
    platformName = platform.name || platform.title || platform.platform_name || '';
  } else {
    return null;
  }

  const lowerPlatform = platformName.toLowerCase();
  
  if (lowerPlatform.includes('pc') || lowerPlatform.includes('windows')) {
    return <AiFillAppstore className="w-4 h-4" />;
  }
  if (lowerPlatform.includes('playstation') || lowerPlatform.includes('ps')) {
    return <SiPlaystation className="w-4 h-4" />;
  }
  if (lowerPlatform.includes('xbox')) {
    return <FaXbox className="w-4 h-4" />;
  }
  if (lowerPlatform.includes('nintendo') || lowerPlatform.includes('switch') || lowerPlatform.includes('ns')) {
    return <BsNintendoSwitch className="w-4 h-4" />;
  }
  if (lowerPlatform.includes('ios') || lowerPlatform.includes('iphone')) {
    return <SiApple className="w-4 h-4" />;
  }
  if (lowerPlatform.includes('android')) {
    return <SiAndroid className="w-4 h-4" />;
  }
  
  return <AiFillAppstore className="w-4 h-4" />;
};