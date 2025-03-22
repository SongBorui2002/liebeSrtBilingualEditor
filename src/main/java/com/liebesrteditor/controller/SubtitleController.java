package com.liebesrteditor.controller;

import com.liebesrteditor.model.SubtitleEntry;
import com.liebesrteditor.service.SubtitleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/subtitle")
@CrossOrigin
public class SubtitleController {

    @Autowired
    private SubtitleService subtitleService;

    @PostMapping("/upload")
    public ResponseEntity<List<SubtitleEntry>> uploadSubtitle(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(subtitleService.parseSrtFile(file));
    }

    @PostMapping("/export")
    public ResponseEntity<String> exportSubtitle(@RequestBody List<SubtitleEntry> entries) {
        return ResponseEntity.ok(subtitleService.exportSrt(entries));
    }
}