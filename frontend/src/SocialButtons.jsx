import { Button, Link } from '@radix-ui/themes';
import { FiGithub } from 'react-icons/fi';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

/**
 * SocialButtons component
 * This component displays a set of social media buttons, including links to the developer's GitHub, LinkedIn, and Instagram profiles.
 */

function SocialButtons() {
  return (
    <div className="social-buttons">
      {/* GitHub button */}
      <Button role="link" color="amber" variant="soft">
        <FiGithub />
        <Link href="https://github.com/hrishikesh-srihari" target="_blank">
          Github
        </Link>
      </Button>

      {/* LinkedIn button */}
      <Button role="link" color="amber" variant="soft">
        <FaLinkedin />
        <Link href="https://www.linkedin.com/in/hrishikesh-srihari000/" target="_blank">
          LinkedIn
        </Link>
      </Button>

      {/* Instagram button */}
      <Button role="link" color="amber" variant="soft">
        <FaInstagram />
        <Link href="https://www.instagram.com/rishisrihari/" target="_blank">
          Instagram
        </Link>
      </Button>
    </div>
  );
}

export default SocialButtons;