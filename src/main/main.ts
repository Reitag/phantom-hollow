import { gameConfig } from '@/main/settings';

if (process.env.NODE_ENV === 'development') {
  const container = document.getElementById('app');
  if (container) {
    container.classList.add('dev-mode');
  }
}

new Phaser.Game(gameConfig);
