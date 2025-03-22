package com.liebesrteditor.service;

import com.liebesrteditor.model.SubtitleEntry;
import com.liebesrteditor.utils.SrtParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class SubtitleService {

    @Autowired
    private SrtParser srtParser;

    public List<SubtitleEntry> parseSrtFile(MultipartFile file) {
        try {
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            return srtParser.parseSrt(content);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse SRT file", e);
        }
    }

    public String exportSrt(List<SubtitleEntry> entries) {
        return srtParser.exportSrt(entries);
    }
}