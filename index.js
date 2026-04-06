const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const config = {
    host: "darkblademc.joinmc.world", 
    port: 20674,        // ĐÃ FIX CHUẨN: 20674 (Không bao giờ sai nữa!)
    username: 'Pro_SuperBot',
    version: '1.21.1',  
    password: 'matkhaucuaban' 
};

function startBot() {
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version
    });

    bot.loadPlugin(pathfinder);

    console.log('--- Bot đang kết nối... ---');

    bot.on('spawn', () => {
        console.log('Bot đã vào server thành công!');
        
        // 1. Đăng ký & Đăng nhập
        setTimeout(() => {
            bot.chat(`/register ${config.password} ${config.password}`);
            bot.chat(`/login ${config.password}`);
            console.log('Đã thực hiện Login/Register.');
        }, 2000);

        // 2. Chuỗi hành động quậy phá (8 giây đổi 1 lần)
        const actionInterval = setInterval(async () => {
            if (!bot.entity) return;
            const r = Math.random();
            
            try {
                if (r < 0.25) { // Phá block
                    const block = bot.findBlock({
                        matching: (b) => ['grass_block', 'dirt', 'stone', 'sand', 'short_grass', 'tall_grass'].includes(b.name),
                        maxDistance: 4
                    });
                    if (block) {
                        console.log('Đang đập block...');
                        await bot.dig(block);
                    }
                } else if (r < 0.5) { // Đi dạo
                    const x = bot.entity.position.x + (Math.random() - 0.5) * 10;
                    const z = bot.entity.position.z + (Math.random() - 0.5) * 10;
                    bot.pathfinder.setMovements(new Movements(bot));
                    bot.pathfinder.setGoal(new goals.GoalNear(x, bot.entity.position.y, z, 1));
                    console.log('Đang đi dạo...');
                } else if (r < 0.7) { // Xoay + Nhảy
                    bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                } else { // Chat random
                    const msgs = ["Hello ae", "Server on nhe", "Checking 24/7...", "Bot is working"];
                    bot.chat(msgs[Math.floor(Math.random() * msgs.length)]);
                }
            } catch (e) { }
        }, 8000);

        // 3. Đúng 1 phút (60s) thì tự thoát để tiết kiệm quota
        setTimeout(() => {
            console.log('Hết 1 phút hoạt động. Đang thoát...');
            clearInterval(actionInterval);
            bot.quit();
        }, 60000);
    });

    // 4. Khi thoát ra, đợi 60 giây rồi vào lại từ đầu
    bot.on('end', () => {
        console.log('Bot đã thoát. Nghỉ 60 giây trước khi quay lại...');
        setTimeout(() => {
            startBot();
        }, 60000);
    });

    bot.on('error', (err) => {
        console.log('Lỗi kết nối:', err.message);
    });
}

// Chạy bot
startBot();
