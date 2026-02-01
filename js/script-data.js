// --- 剧本数据: 游戏开场文字脚本 (中英双语版) ---
const fullScript = [
    {
        text: "这里的风，有牙齿。<br>The wind here has teeth.",
        mood: "wind",
        duration: 2000
    },
    {
        text: "传说在北纬24度的腹地，<br>风能嚼碎坚硬的花岗岩，<br>把一切文明的痕迹还原成沙砾。<br>Legend has it that in the hinterland of 24°N,<br>the wind can chew through solid granite,<br>reducing every trace of civilization to grit.",
        mood: "wind",
        duration: 5000
    },
    {
        text: "公元 2026 年，冬。<br>Winter, 2026 AD.",
        mood: "dark",
        duration: 2000
    },
    {
        text: "探测器的指针在红海沿岸疯狂跳动。<br>The detector's needle dances frantically along the Red Sea coast.",
        mood: "signal",
        duration: 2000
    },
    {
        text: "这里本该是荒漠，<br>但频谱仪却收到了一段奇怪的信号——<br>那是一串极其规律的脉冲，<br>像是某种巨大机械的心跳。<br>This should have been a wasteland,<br>yet the spectrometer picked up a strange signal—<br>a sequence of pulses so rhythmic,<br>it resembles the heartbeat of some colossal machine.",
        mood: "signal",
        duration: 6000
    },
    {
        text: "有人说它是海市蜃楼，<br>有人说那是通往下一个纪元的源代码。<br>Some say it is a mirage,<br>others claim it is the source code for the next epoch.",
        mood: "signal",
        duration: 4000
    },
    {
        text: "我们将涉沙而去，<br>探索这心跳的本源和力量。<br>We will wade through the sand,<br>to explore the source and power of this heartbeat.",
        mood: "wind",
        duration: 3000
    },

    // 水墨篇章
    {
        text: "我们携带了<span style='font-weight:bold; color:#000;'>纸上的烟云</span>。<br>We carry with us <span style='font-weight:bold; color:#000;'>mist and clouds on paper</span>.",
        mood: "ink",
        duration: 3000
    },
    {
        text: "它由松木燃烧后的灰烬与水调和而成。<br>表面上看，那只是黑与白的潦草涂抹，<br>但千万别眨眼——<br>那里面栖居着东方的五岳与长河。<br>Forged from water and the soot of burnt pine.<br>On the surface, it is but a scrawl of black and white,<br>but do not blink—<br>for within it dwell the Five Great Mountains and long rivers of the East.",
        mood: "ink",
        duration: 7000
    },
    {
        text: "在这片色彩饱和度过载的金色沙漠里，<br>我们将展开这幅只有双色的画卷。<br>In this golden desert where color saturation overloads,<br>we shall unfurl this scroll of only two tones.",
        mood: "ink",
        duration: 5000
    },
    {
        text: "它不反光，<br>却能吸收所有的燥热，<br>释放出一种名为“留白”的凉意。<br>It reflects no light,<br>yet absorbs all the scorching heat,<br>releasing a chill known as 'White Space'.",
        mood: "ink",
        duration: 5000
    },

    // 红色契约篇章
    {
        text: "我们携带了<span class='highlight-red'>红色的契约</span>。<br>We have brought a <span class='highlight-red'>Crimson Covenant</span>.",
        mood: "red",
        duration: 4000
    },
    {
        text: "那是一种比沙漠烈日更耀眼的红，<br>是用朱砂画就的图腾。<br>它不属于现在，而属于未来。<br>A red more blinding than the desert sun,<br>a totem drawn in cinnabar.<br>It belongs not to the present, but to the future.",
        mood: "red",
        duration: 5000
    },
    {
        text: "在这个没有严冬的国度，<br>我们将贴上这些方正的符号，<br>用来召唤一个他们或许从未真正理解的季节——<br>In this land that knows no harsh winter,<br>we shall affix these square symbols,<br>to summon a season they may never have truly understood—",
        mood: "red",
        duration: 5500
    },
    {
        text: "<span class='highlight-red' style='font-size:2em'>“春”</span><br><span class='highlight-red' style='font-size:2em'>'Spring'</span>",
        mood: "red",
        duration: 3000
    },
    {
        text: "这不仅是祝福，<br>更是一种古老的护身符，<br>向时间许诺：下一个轮回，万物安好。<br>It is not merely a blessing,<br>but an ancient amulet,<br>promising time: in the next cycle, all shall be well.",
        mood: "red",
        duration: 5000
    },

    // 迷雾篇章
    {
        text: "至于剩下的航程？<br>哪怕是我们自己，也只握着半张残卷。<br>As for the rest of the voyage?<br>Even we hold only half a fragmented scroll.",
        mood: "default",
        duration: 4000
    },
    {
        text: "在这片被折叠的时空里，<br>指南针是会撒谎的。<br>In this folded spacetime,<br>compasses tell lies.",
        mood: "dark",
        duration: 3000
    },
    {
        text: "也许下一秒，我们会闯入<br>《一千零一夜》里都不曾记载的折叠空间；<br>Perhaps in the next second, we will intrude upon<br>a folded space unrecorded even in *One Thousand and One Nights*;",
        mood: "default",
        duration: 4000
    },
    {
        text: "也许在某个转角，我们会与某种<br>超越了“工业”与“诗歌”的第三种存在迎面相撞。<br>Perhaps at some corner, we will collide head-on<br>with a third existence that transcends both 'Industry' and 'Poetry'.",
        mood: "default",
        duration: 5000
    },
    {
        text: "这是一场没有剧本的潜行。<br>This is an unscripted infiltration.",
        mood: "default",
        duration: 2000
    },
    {
        text: "我们不是走向黑暗，<br>而是走入一片<span style='color:#fff; text-shadow:0 0 10px gold;'>金色的迷雾</span>。<br>We are not walking into darkness,<br>but stepping into a <span style='color:#fff; text-shadow:0 0 10px gold;'>Golden Mist</span>.",
        mood: "gold-mist",
        duration: 4000
    },
    {
        text: "唯一的确定，就是不确定本身。<br>The only certainty, is uncertainty itself.",
        mood: "gold-mist",
        duration: 3000
    },
    {
        text: "在这个冬天，<br>请把你的频率调至与我们同步，保持监听。<br>This winter,<br>please tune your frequency to ours, and stay listening.",
        mood: "end",
        duration: 4000
    },
    {
        text: "因为接下来的每一个字节，<br>都将是从“奇迹”的中心发回的、<br>绝版的现场报告。<br>For every byte that follows,<br>shall be an out-of-print field report,<br>transmitted from the very center of 'Miracle'.",
        mood: "end",
        duration: 7000
    }
];