// 全局变量存储字幕数据
let subtitleData = [];

// 当页面加载完成时初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const uploadBtn = document.getElementById('uploadBtn');
    const exportBtn = document.getElementById('exportBtn');
    const fileInput = document.getElementById('srtFile');
    const editorContainer = document.getElementById('editorContainer');
    const englishSubtitles = document.getElementById('englishSubtitles');
    const chineseSubtitles = document.getElementById('chineseSubtitles');

    // 上传按钮点击事件
    uploadBtn.addEventListener('click', function() {
        if (fileInput.files.length === 0) {
            alert('请先选择字幕文件');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // 发送文件到后端
        fetch('/api/subtitle/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                subtitleData = data;
                renderSubtitles();
                editorContainer.classList.remove('d-none');
            })
            .catch(error => {
                console.error('上传失败:', error);
                alert('上传失败，请重试');
            });
    });

    // 导出按钮点击事件
    exportBtn.addEventListener('click', function() {
        // 收集所有编辑后的字幕数据
        const updatedSubtitles = collectSubtitleData();

        // 发送到后端进行导出
        fetch('/api/subtitle/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSubtitles)
        })
            .then(response => response.blob())
            .then(blob => {
                // 创建下载链接
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'subtitle.srt';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('导出失败:', error);
                alert('导出失败，请重试');
            });
    });

    // 同步滚动处理
    englishSubtitles.addEventListener('scroll', function() {
        chineseSubtitles.scrollTop = englishSubtitles.scrollTop;
    });

    chineseSubtitles.addEventListener('scroll', function() {
        englishSubtitles.scrollTop = chineseSubtitles.scrollTop;
    });
});

// 渲染字幕到页面
function renderSubtitles() {
    const englishSubtitles = document.getElementById('englishSubtitles');
    const chineseSubtitles = document.getElementById('chineseSubtitles');

    englishSubtitles.innerHTML = '';
    chineseSubtitles.innerHTML = '';

    subtitleData.forEach((entry, index) => {
        // 创建英文字幕条目
        const englishEntry = createSubtitleEntry(entry, index, true);
        englishSubtitles.appendChild(englishEntry);

        // 创建中文字幕条目
        const chineseEntry = createSubtitleEntry(entry, index, false);
        chineseSubtitles.appendChild(chineseEntry);
    });
}

// 创建字幕条目元素
function createSubtitleEntry(entry, index, isEnglish) {
    const div = document.createElement('div');
    div.className = 'subtitle-entry';
    div.innerHTML = `
        <div class="time-code">${entry.timeCode}</div>
        <textarea class="subtitle-text" data-index="${index}" data-type="${isEnglish ? 'english' : 'chinese'}"
            >${isEnglish ? entry.englishText : entry.chineseText}</textarea>
    `;

    // 添加文本框变化事件
    const textarea = div.querySelector('textarea');
    textarea.addEventListener('input', function() {
        const idx = this.dataset.index;
        const type = this.dataset.type;
        if (type === 'english') {
            subtitleData[idx].englishText = this.value;
        } else {
            subtitleData[idx].chineseText = this.value;
        }
    });

    return div;
}

// 收集编辑后的字幕数据
function collectSubtitleData() {
    return subtitleData.map(entry => ({
        index: entry.index,
        timeCode: entry.timeCode,
        englishText: entry.englishText,
        chineseText: entry.chineseText
    }));
}
