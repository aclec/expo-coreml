import ExpoModulesCore
import Foundation
import CoreML
import Vision

public class ExpoCoremlModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        Name("ExpoCoreml")
        
        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("hello") {
            return "Hello world! 👋"
        }
        
        
        AsyncFunction("compileModel") { (modelURL: URL, promise: Promise) in
            
            //let modelURL = URL(fileURLWithPath: url)
            do {
                let compiledModelURL = try MLModel.compileModel(at: modelURL)
                promise.resolve(compiledModelURL.absoluteString)
            } catch {
                promise.resolve(NSNull())
            }
            
        }
        
        
        AsyncFunction("predict") { (modelURL: URL, imageURL: URL, promise: Promise) in
            predictObject(modelURL: modelURL, imageURL: imageURL, promise: promise)
        }
        
        
        AsyncFunction("classify") { (modelURL: URL, imageURL: URL, promise: Promise) in
            classifyImage(modelURL: modelURL, imageURL: imageURL, promise: promise)
        }
        
    }
}
