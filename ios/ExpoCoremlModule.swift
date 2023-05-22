import ExpoModulesCore
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
        
        
        AsyncFunction("compileModel") { (url: URL, promise: Promise) in
            
            do {
                let compiledModelURL = try MLModel.compileModel(at: url)
                promise.resolve(compiledModelURL.absoluteString)
            } catch {
                promise.resolve(NSNull())
            }
            
        }
        
        
        AsyncFunction("predict") { (modelURL: URL, imageURL: URL, promise: Promise) in
            
            do {
                let model = try MLModel(contentsOf: modelURL)
                let visionModel = try VNCoreMLModel(for: model)
                
                let request = VNCoreMLRequest(model: visionModel) { (request, error) in
                    if let error = error {
                        promise.resolve(NSNull())
                        return
                    }
                    
                    guard let results = request.results as? [VNClassificationObservation] else {
                        promise.resolve(NSNull())
                        return
                    }

                    promise.resolve(results)
                }
                
                let handler = VNImageRequestHandler(url: imageURL, options: [:])
                try handler.perform([request])
            } catch {
                promise.resolve(NSNull())
            }
            
        }
    }
}
