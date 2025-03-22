package com.liebesrteditor.utils;

import com.liebesrteditor.model.SubtitleEntry;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class SrtParser {
    public List<SubtitleEntry> parseSrt(String content) throws IOException {
        List<SubtitleEntry> entries = new ArrayList<>();
        BufferedReader reader = new BufferedReader(new StringReader(content));

        String line;
        SubtitleEntry currentEntry = null;
        boolean isEnglish = true;

        while ((line = reader.readLine()) != null) {
            line = line.trim();

            if (line.isEmpty()) {
                continue;
            }

            if (line.matches("\\d+")) {
                if (isEnglish) {
                    currentEntry = new SubtitleEntry();
                    currentEntry.setIndex(Integer.parseInt(line));
                }
                continue;
            }

            if (line.contains("-->")) {
                if (currentEntry != null) {
                    currentEntry.setTimeCode(line);
                }
                continue;
            }

            if (currentEntry != null) {
                if (isEnglish) {
                    currentEntry.setEnglishText(line);
                    isEnglish = false;
                } else {
                    currentEntry.setChineseText(line);
                    entries.add(currentEntry);
                    isEnglish = true;
                }
            }
        }

        return entries;
    }
    public String exportSrt(List<SubtitleEntry> entries) {
        StringBuilder sb = new StringBuilder();

        for (SubtitleEntry entry : entries) {
            // 英文字幕
            sb.append(entry.getIndex()).append("\n");
            sb.append(entry.getTimeCode()).append("\n");
            sb.append(entry.getEnglishText()).append("\n\n");

            // 中文字幕
            sb.append(entry.getIndex() + 1).append("\n");
            sb.append(entry.getTimeCode()).append("\n");
            sb.append(entry.getChineseText()).append("\n\n");
        }

        return sb.toString();
    }
}

