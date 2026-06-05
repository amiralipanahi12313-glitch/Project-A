const bedrock = require('bedrock-protocol');

const HOST = process.env.MC_HOST || 'Amirali_Panahi5944.aternos.me';
const PORT = parseInt(process.env.MC_PORT || '36000');

class Citizen {
  constructor(name) {
    this.name = name;
    this.hunger = 100;
    this.wood = 0;
    this.emerald = 0;
    this.words = new Set();

    this.bot = bedrock.createClient({
      host: HOST,
      port: PORT,
      username: name,
      offline: true
    });

    this.bot.on('spawn', () => {
      console.log(`${this.name} وارد جهان شد.`);
      this.say('زنده باد جامعه!');
    });

    this.bot.on('text', (pkt) => {
      if (pkt.source_name === this.name) return;
      const msg = pkt.message;
      for (let w of msg.split(' ')) {
        w = w.toLowerCase().replace(/[^a-zA-Zآ-ی]/g, '');
        if (w) this.words.add(w);
      }
      if (msg.includes('زمرد') && msg.includes('درخواست')) {
        this.say('متأسفانه خزانه در سرور ابری غیرفعال است، ولی پیامت رسید!');
      }
    });

    this.interval = setInterval(() => this.update(), 10000);
  }

  update() {
    this.hunger -= 15;
    if (this.hunger <= 0) {
      console.log(`${this.name} از گرسنگی مرد.`);
      clearInterval(this.interval);
      this.bot.close();
      return;
    }
    if (this.hunger < 50) {
      this.wood += 2;
      this.say(`چوب جمع کردم (چوب: ${this.wood}).`);
    } else {
      const wordList = [...this.words].join(' ') || 'هنوز واژه‌ای نیست';
      this.say(`سلام! واژه‌ها: ${wordList}. گرسنگی: ${this.hunger}%`);
    }
  }

  say(msg) {
    this.bot.queue('text', {
      type: 'chat', needs_translation: false, source_name: this.name,
      xuid: '', platform_chat_id: '', message: msg
    });
  }
}

console.log('جامعه رباتیک در حال اجراست...');
new Citizen('Robot_Shahin');
setTimeout(() => new Citizen('Robot_Mina'), 5000);
