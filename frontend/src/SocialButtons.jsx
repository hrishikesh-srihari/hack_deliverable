import { Button, Link } from '@radix-ui/themes';
import { FiGithub } from 'react-icons/fi';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

function SocialButtons() {
  return (
    <div className="social-buttons">
      <Button role="link" color="amber" variant="soft">
        <FiGithub />
        <Link href="https://github.com/hrishikesh-srihari" target="_blank">
          Github
        </Link>
      </Button>

      <Button role="link" color="amber" variant="soft">
        <FaLinkedin />
        <Link href="https://www.linkedin.com/in/hrishikesh-srihari000/" target="_blank">
          LinkedIn
        </Link>
      </Button>
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