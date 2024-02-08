package config

import (
	"fmt"
	"path/filepath"

	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)


func getEncoder() zapcore.Encoder {
	encoder_config := zap.NewProductionEncoderConfig()
	encoder_config.EncodeTime = zapcore.ISO8601TimeEncoder
	encoder_config.EncodeLevel = zapcore.CapitalLevelEncoder
	return zapcore.NewConsoleEncoder(encoder_config)
}

func getWriter(level string) zapcore.WriteSyncer{
	lumberJackLogger := &lumberjack.Logger{
		Filename:   filepath.Join(GetGlobalValue("project_dir").(string),fmt.Sprintf("/log/%s.log",level)),
		MaxSize:    10,
		MaxBackups: 5,
		MaxAge:     30,
		Compress:   false,
	}
	return zapcore.AddSync(lumberJackLogger)
}

func GetCore(){
	encoder := getEncoder()
	info_writer := getWriter("info")
	error_writer := getWriter("error")
	info_core := zapcore.NewCore(encoder,info_writer,zapcore.InfoLevel)
	error_core := zapcore.NewCore(encoder,error_writer,zapcore.ErrorLevel)
	core := zapcore.NewTee(info_core,error_core)
	MyLogger := zap.New(core,zap.AddCaller(),zap.AddCallerSkip(1))
	zap.ReplaceGlobals(MyLogger)

}


