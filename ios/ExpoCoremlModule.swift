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
            
//                let modelURL = URL(fileURLWithPath: url)
            do {
                let compiledModelURL = try MLModel.compileModel(at: modelURL)
                promise.resolve(compiledModelURL.absoluteString)
            } catch {
                promise.resolve(NSNull())
            }
            
        }
        
        
        AsyncFunction("predict") { (modelURL: URL, imageURL: URL, promise: Promise) in
            
            do {
                
                let model = try MLModel(contentsOf: modelURL)
                let visionModel = try VNCoreMLModel(for: model)
                let image = CIImage(contentsOf: imageURL)
                
                let request = VNCoreMLRequest(model: visionModel) { (request, error) in
                    if let error = error {
                        promise.resolve(NSNull())
                      return
                    }
                    
                    guard let results = request.results as? [VNRecognizedObjectObservation] else {
                        promise.resolve(NSNull())
                      return
                    }

                    let predictionResults = results.map { [
                        "confidence": $0.confidence,
                        "label": $0.labels.first?.identifier ?? "",
                        "boundingBox": [
                            "x": $0.boundingBox.origin.x,
                            "y": $0.boundingBox.origin.y,
                            "width": $0.boundingBox.size.width,
                            "height": $0.boundingBox.size.height
                        ],
                    ] }
                    promise.resolve(predictionResults)
                    
              }
                
                let handler = VNImageRequestHandler(ciImage: image!);
                try handler.perform([request]);
              
            } catch {
                promise.resolve("Failed to load the model")
            }
            
        }
    }
}
