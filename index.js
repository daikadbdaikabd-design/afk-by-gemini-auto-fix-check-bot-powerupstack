const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const config = {
    host: "darkblademc.joinmc.world", // Thay IP server vào đây
    port:  20674,        // Thay Port server
    username: 'Pro_SuperBot',
    version: '1.20.1',  // Đổi cho đúng bản server của bạn
    password: 'matkhaucuaban' // Đặt mật khẩu cho bot
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
        console.log('Bot đã vào server!');
        
        // 1. Đăng ký & Đăng nhập (Gửi sau 2 giây cho chắc)
        setTimeout(() => {
            bot.chat(`/register ${config.password} ${config.password}`);
            bot.chat(`/login ${config.password}`);
            console.log('Đã thực hiện Login/Register.');
        }, 2000);

        // 2. Bắt đầu chuỗi hành động quậy phá
        const actionInterval = setInterval(async () => {
            const r = Math.random();
            
            try {
                if (r < 0.25) { // Phá block
                    const block = bot.findBlock({
                        matching: (b) => ['grass_block', 'dirt', 'stone', 'sand', 'tall_grass'].includes(b.name),
                        maxDistance: 4
                    });
                    if (block) {
                        console.log('Đang đập block...');
                        await bot.dig(block);
                    }
                } else if (r < 0.5) { // Chạy bộ
                    const x = bot.entity.position.x + (Math.random() - 0.5) * 10;
                    const z = bot.entity.position.z + (Math.random() - 0.5) * 10;
                    bot.pathfinder.setMovements(new Movements(bot));
                    bot.pathfinder.setGoal(new goals.GoalNear(x, bot.entity.position.y, z, 1));
                    console.log('Đang đi dạo...');
                } else if (r < 0.7) { // Xoay đầu + Nhảy
                    bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI);
                    bot.setControlState('jump', true);
                    setTimeout(() => bot.setControlState('jump', false), 500);
                } else { // Chat ngẫu nhiên
                    const msgs = ["Hello ae", "Server ngon vcl", "Chilling...", "24/7 check!"];
                    bot.chat(msgs[Math.floor(Math.random() * msgs.length)]);
                }
            } catch (e) { /* Bỏ qua lỗi nhỏ */ }
        }, 8000); // Cứ 8 giây đổi hành động một lần

        // 3. Đúng 1 phút (60s) thì tự thoát
        setTimeout(() => {
            console.log('Hết 1 phút hoạt động. Đang thoát...');
            clearInterval(actionInterval);
            bot.quit();
        }, 60000);
    });

    // 4. Khi thoát ra, đợi 1 phút rồi vào lại từ đầu
    bot.on('end', () => {
        console.log('Bot đã thoát. Chờ 60 giây để vào lại...');
        setTimeout(() => {
            startBot();
        }, 60000);
    });

    bot.on('error', (err) => console.log('Lỗi:', err.message));
}

// Chạy bot
startBot();darkblademc.joinmc.world
