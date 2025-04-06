---
title: I Want to Search with WebGPU!
author: producer
date: 2025-03-04T00:00:00+09:00
tag:
    - techarticle
    - staticseek
---
### WebGPU for Search, Who Knew This Was Possible

In our previous explorations, we successfully implemented fuzzy search for English with good performance. However, for Japanese text, the implementation using bigrams that permit insufficient n-gram matches resulted in an excessive number of false positives, making it seemingly ineffective. We need to consider alternative approaches.

During this time, a colleague mentioned "offloading search operations to the GPU when searches become computationally intensive." The concept of GPU-based searching was new to me but intriguing. I decided to immediately explore implementation possibilities.

In Chrome, [WebGPU](https://developer.mozilla.org/ja/docs/Web/API/WebGPU_API) enables direct GPU utilization from the browser. WebGPU supports compute shaders in addition to traditional 3D graphics shaders. This aligns perfectly with our objectives, so I opted to implement using WebGPU.

### Understanding GPU Architecture

Having previously worked with OpenGL ES2.0, I initially approached this with a casual attitude, assuming I could simply write shaders without deep consideration. However, this proved to be an insufficient approach, resulting in poor performance. Recognizing the need to revisit fundamentals, I decided to investigate GPU microarchitecture.

In this article, I reference the [AMD Radeon RDNA 3.5 Instruction Set Architecture Reference](https://www.amd.com/content/dam/amd/en/documents/radeon-tech-docs/instruction-set-architectures/rdna35_instruction_set_architecture.pdf) (PDF link). Although I use an NVIDIA GPU, I couldn't locate hardware configuration documentation from NVIDIA, hence the reference to AMD Radeon's materials.

Modern GPUs are typically designed based on the [Single Instruction, Multiple Threads (SIMT)](https://ja.wikipedia.org/wiki/Single_Instruction,_Multiple_Threads) execution model, as I learned from colleagues. This model addresses one of the bottlenecks in contemporary computing: memory access latency. By simultaneously running numerous threads and switching between them as memory data becomes available, the perceived latency from a thread's perspective is minimized.

In SIMT, a single instruction is processed simultaneously by multiple threads. In RDNA, threads are referred to as work-items, and in RDNA3.5, 32 work-items (Wave32) or 64 work-items (Wave64) can be processed concurrently. Multiple Wave32/64 units collectively form a Work-group, with a maximum size of 256 work-items (or 8 Wave32 units) under WebGPU's standard configuration.

![](https://storage.googleapis.com/zenn-user-upload/d746e721d364-20250228.png)

![](https://storage.googleapis.com/zenn-user-upload/2773792e7ed2-20250228.png)

Figures 1 and 2 illustrate the hardware configuration of RDNA3.5-based GPUs, extracted from the aforementioned document. GPUs consist of multiple Work-group Processors (WGPs). Each WGP comprises 2 Compute Units (CUs), and each CU consists of 2 SIMDs. A SIMD contains 1 Scalar ALU (SALU) and 32 Vector ALUs (VALUs), which access Scalar General-purpose Registers (SGPRs) and Vector General-purpose Registers (VGPRs) respectively. Each SIMD has one Program Counter (PC). The SALU appears to be RDNA-specific and is reportedly absent in other manufacturers' GPUs.

Let me clarify some terminology. The PC is hardware that controls program execution, essentially a pointer indicating which part of the program is being executed. Specifically, it points to the currently executing instruction in machine code within instruction memory. The ALU (Arithmetic Logic Unit) performs calculations. GPR (General-Purpose Register) is a memory element faster than cache—essentially representing temporary variables in a program. ALUs use GPR values for calculations and write results back to GPRs. GPRs exchange data with memory using the Load Store Unit (LSU), allowing processing of memory data and writing results back to memory.

In RDNA3.5, I believe one Wave32/64 is assigned to one SIMD for concurrent execution. This is evidenced by each SIMD having one PC connected to 32 VALUs. Since 32 VALUs share the instruction pointed to by the PC, it suggests that 32 work-items (threads) operate in parallel.

A crucial point concerns VALUs and VGPRs. When thinking of SIMD, one might envision vector operations as "calculating four different values x, y, z, w in a single instruction." However, this doesn't appear to be the case. Despite being labeled "Vector," registers aren't bundled as xyzw in a single register but are composed of standard 32-bit floating-point registers. Therefore, shaders should be written as conventional scalar programs, with the caveat that threads must synchronize efficiently.

### Steps for Computation Using WebGPU

Executing compute shaders with WebGPU involves the following steps:

1. Allocate buffers on the GPU and write data
2. Compile the shader
3. Specify the number of shader execution threads and run
4. Copy results from the GPU buffer

Compute shaders can only access buffers on the GPU. Consequently, input data must be written from JavaScript to the GPU buffer, processed by the shader, with results written back to the buffer, and finally copied back to a JavaScript buffer after execution.

Here are more detailed steps (note the technical terminology):

1. [Obtain a `GPUDevice` from the browser](https://developer.mozilla.org/ja/docs/Web/API/GPUAdapter/requestDevice)
2. [Create a `GPUBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer) for GPU usage
3. [Create a `GPUBindGroup`](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBindGroup) that maps buffer names used in the shader to corresponding buffer numbers created in step 2
4. [Compile the shader](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createShaderModule) written as a JavaScript string and [convert it to a `GPUComputePipeline`](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createComputePipeline)
5. [Write data to the `GPUBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/writeBuffer) via the [`GPUQueue`](https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue)
6. Send execution commands to the GPU through the `GPUQueue`. Execution commands are written to a [`GPUCommandBuffer`](https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandBuffer) using a [`GPUCommandEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/GPUCommandEncoder), and this `GPUCommandBuffer` is [submitted](https://developer.mozilla.org/en-US/docs/Web/API/GPUQueue/submit) via the `GPUQueue`.
   6.1 Generate a [`GPUComputePassEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder) from the `GPUCommandEncoder`
   6.2 [Specify the pipeline](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/setPipeline) to execute in the ComputePass
   6.3 [Specify the `GPUBindGroup`](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/setBindGroup) of buffers used in the pipeline for the ComputePass
   6.4 [Set the number of workgroups](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/dispatchWorkgroups) to process in the ComputePass
   6.5 Write a data copy command to the `GPUCommandBuffer` from the `GPUBuffer` containing results to a JavaScript-accessible buffer
   6.6 `submit` the `GPUCommandBuffer` created up to step 6.5 to the `GPUQueue`
7. [mapAsync](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/mapAsync) the `GPUBuffer` containing results to read the data

While these steps may seem complex, once a functioning program is established, subsequent modifications are manageable. Please refer to my [preprocessing](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L75-L132) and [execution procedure](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L150-L211) implementations. To break it down further:

1. [Obtaining a `GPUDevice`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L76-L77)
2. [Creating `GPUBuffer`s](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L80-L89)
3. [Creating a `GPUBindGroup`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L99-L123)
4. [Generating a `GPUPipeline` (shader compilation)](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L125-L131)
5. [Writing to `GPUBuffer`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L165-L170)
6. [Creating a `GPUCommandBuffer`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L174-L186)
7. [Execution](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L187)
8. [Reading results](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L189-L204)

Steps 1-4 serve as preprocessing and can be reused across multiple GPU commands. The search text is also written once during initialization and reused. (5) Other buffer writes and (6) `GPUCommandBuffer` generation must be performed for each GPU execution.

### Writing Compute Shaders

Compute shaders are written in [WGSL](https://gpuweb.github.io/gpuweb/wgsl/). Here's a simple shader example that searches for the character "痔" (hemorrhoid). It is [committed to the repository](https://github.com/osawa-naotaka/staticseek/blob/main/ref/webgpu/1char.ts). The [TypeScript code](https://github.com/osawa-naotaka/staticseek/blob/main/ref/webgpu/1char.ts) that executes this WGSL code is also available for reference.

```wgsl
@group(0) @binding(0) var<storage, read> data: array<u32>;
@group(0) @binding(2) var<storage, read_write> result: array<u32>;
@group(0) @binding(3) var<storage, read_write> pointer: atomic<u32>;

@compute @workgroup_size(256) fn cs(
    @builtin(global_invocation_id) id: vec3u
) {
    let keyword = 30164u;
    let cmp = keyword == data[id.x];

    if(cmp) {
        let ptr_pos = atomicAdd(&pointer, 1u);
        result[ptr_pos] = id.x;
    }
}
```

Items beginning with `@` are called [Attributes](https://gpuweb.github.io/gpuweb/wgsl/#attributes), which qualify objects such as variables and buffers.

Excluding attributes, the shader function is defined as follows:

```wgsl
fn cs(id: vec3u) {
 ...
}
```

While the function name can be anything, I've defined it as `cs` here. This function is designated as a compute shader [entry point](https://gpuweb.github.io/gpuweb/wgsl/#entry-point-decl) by specifying the `@compute` attribute. The entry point is also specified by name in [createComputePipeline](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/webgpu/1char.ts#L11-L18) (though this can be omitted if there's only one function). Compute shader parameters can include any number of [built-in input values](https://gpuweb.github.io/gpuweb/wgsl/#built-in-input-value). In this example, I've specified the built-in input value `global_invocation_id` to be accessible as `id` via an attribute. Compute shaders have no return values; results are written to GPU buffers.

#### Work-item Generation in Compute Shaders

This shader searches for the character "痔," but notably lacks a for-loop to iterate through the entire text area. This relates to the SIMT architecture discussed earlier.

In SIMT architecture, generating as many threads as possible helps hide memory read latency. Rather than using long loops within a single thread to match multiple characters, it's more efficient to keep loops short and create many threads for better memory access latency concealment. The shortest loop is no loop at all—a shader that checks for a single character match, which is then launched for the entire length of the text.

When processing matches in parallel without loops, we need to determine which thread processes which character position in the text. The built-in input value [global_invocation_id](https://gpuweb.github.io/gpuweb/wgsl/#built-in-values-global_invocation_id) helps with this. Simply put, it's a unique ID assigned to each thread, which can be used directly as the text search position.

The `global_invocation_id` is declared as type `vec3`. While this ID can use up to three dimensions, we only need one dimension for text position. We specify the workgroup size for `fn cs` as `@workgroup_size(256, 1, 1)`, corresponding to x, y, and z. The x-value is 256 because this is the maximum value in WebGPU's default settings, and we want it to be a multiple of 32 due to hardware configuration considerations. Setting y and z values to 1 ensures that the invocation_id within a workgroup only increments in the x direction. In the parameter declared as `@builtin(global_invocation_id) id: vec3u`, the x value can be referenced as `id.x`, which is used directly as the text position in `let cmp = keyword == data[id.x];`. Note that when both y and z are 1, you can use the shorthand `@workgroup_size(256)`.

Under these settings, launching a single workgroup results in `id.x` values ranging from 0 to 255. The number of workgroups to launch is specified in the arguments of [GPUComputePassEncoder.dispatchWorkgroups()](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/dispatchWorkgroups). While this can also be specified in three dimensions, since we're only using the x direction, we [specify only the x value](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/webgpu/1char.ts#L41).

The number of workgroups to generate in the x direction depends on the text length. Simply divide the text length by the workgroup_size (256 in this case). This typically results in a remainder, causing out-of-bounds array access which [can cause errors](https://gpuweb.github.io/gpuweb/wgsl/#out-of-bounds-access-sec) that require handling. However, I haven't addressed this yet... I'll need to fix this.

#### Determining Workgroup Size Based on Hardware Configuration and Memory Access Methods

The appropriate workgroup_size is constrained by the architecture discussed earlier. In RDNA3.5's SIMD, 32 work-items (Wave32) are processed simultaneously. Therefore, workgroups (bundles of work-items) should be allocated in multiples of 32. Presumably, non-multiples of 32 would result in unused VALUs, reducing SIMD utilization and consequently extending processing time.

Additionally, I believe performance improves when LSU (Load Store Unit, which transfers data between memory and GPR) is given load addresses that are as close as possible for VGPRs within a Wave32. In this example, adjacent `global_invocation_id` values should naturally be assigned to adjacent VALUs for processing. Thus, the current configuration should be adequate.

Conversely, I created [code that deliberately spaces memory access addresses between adjacent VALUs](https://github.com/osawa-naotaka/staticseek/blob/main/ref/webgpu/loop_1char_uniform.wgsl) for benchmarking. As detailed later, this resulted in a threefold increase in processing time.

#### Specifying GPUBuffers

Memory regions accessible from the GPU are created as `GPUBuffer`s and assigned to variables in WGSL. After creating a `GPUBuffer`, a unique ID is assigned via `GPUBindGroupLayout`. By specifying an attribute like `@binding(id)` for a buffer-representing variable in the shader, the buffer assigned to that ID can be used within the GPU.

##### Creating GPU Buffers

`GPUBuffer`s are generated using [`createBuffer()`](https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createBuffer). This function requires specifying the buffer size in bytes and its [usage purpose](https://developer.mozilla.org/en-US/docs/Web/API/GPUBuffer/usage#value).

Broadly, buffers are categorized as `STORAGE` or `UNIFORM`. In simplified terms, large data buffers use `STORAGE`, while very small constants use `UNIFORM`. `UNIFORM` has certain constraints (cannot specify variable-length buffers, cannot write to them, etc.), making it suitable for specifying single scalar or vector values. These constraints likely make `UNIFORM` access faster, though I haven't measured this. Conversely, `STORAGE` can accommodate larger data sizes. In our example, [the search text, result write buffer, and write buffer pointer are specified as `STORAGE`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L46-L62).

Additionally, we specify how the buffer is accessed from JavaScript. Specifically, whether to copy from JavaScript buffer to `GPUBuffer` (`COPY_DST`) or from `GPUBuffer` to JavaScript buffer (`COPY_SRC`), or both. In our example, the search text is copied once from JavaScript buffer to `GPUBuffer` with no need to write back, so we [specify `COPY_DST`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L49). The buffer for writing search results requires no initialization and only needs to be read from `GPUBuffer`, so we [specify `COPY_SRC`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L55). The write pointer for the result buffer must be initialized to 0 before launch and read after execution to obtain the number of search results, so we [specify both `COPY_SRC` and `COPY_DST`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L61).

```typescript
data: device.createBuffer({
    label: `data buffer`,
    size: input.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
}),

result: device.createBuffer({
    label: `result buffer`,
    size: num_result * 4 * 2,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
}),

result_ptr: device.createBuffer({
    label: `result pointer buffer`,
    size: 4,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
}),
```

##### Binding GPUBuffers to WGSL Variables

To determine which variable name in WGSL can access a generated `GPUBuffer`, we assign unique IDs to GPUBuffers and share these IDs between JavaScript and WGSL.

To assign IDs to `GPUBuffer`s, we [use `createBindGroup()`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/webgpu/1char.ts#L21-L29). Arbitrary binding IDs are specified as integers in the `binding` argument.

```typescript
const bindGroup = device.createBindGroup({
    label: `${name} bindGroup for buffers`,
    layout: pipeline.getBindGroupLayout(0),
    entries: [
        { binding: 0, resource: { buffer: buffers.data } },
        { binding: 2, resource: { buffer: buffers.result } },
        { binding: 3, resource: { buffer: buffers.result_ptr } },
    ],
});
```

For the `layout` argument, we can use `getBindGroupLayout()` from the `GPUPipeline` obtained by compiling WGSL. This requires prior compilation, but to defer compilation, we can [manually create the layout](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L99-L110). Either approach works, but errors will occur if there are discrepancies in buffer counts or usage purposes between WGSL and JavaScript.

The `GPUBindGroup` containing information about ID-assigned `GPUBuffer`s is linked to the shader using [`setBindGroup()`](https://developer.mozilla.org/en-US/docs/Web/API/GPUComputePassEncoder/setBindGroup). At this point, an additional group ID is assigned to the `GPUBuffer` using the `index` parameter.

##### Declaring Buffers in WGSL

In our previous work, we were able to assign IDs to `GPUBuffer`. Now we'll declare variables in WGSL corresponding to these IDs.

For variable declarations, we use [`var`](https://www.w3.org/TR/WGSL/#var-decls).

```wgsl
@group(0) @binding(0) var<storage, read> data: array<u32>;
@group(0) @binding(2) var<storage, read_write> result: array<u32>;
@group(0) @binding(3) var<storage, read_write> pointer: atomic<u32>;
```

By specifying the `@binding()` attribute with the corresponding binding ID for variables declared with `var`, we link the WGSL variables with `GPUBuffer`. The `@group()` specified simultaneously indicates the index (group ID) that was specified when calling `setBindGroup()`.

In a `var` declaration, we specify the [address space (AS)](https://www.w3.org/TR/WGSL/#address-spaces) and [access mode (AM)](https://www.w3.org/TR/WGSL/#access-mode) inside `<AS,AM>`. For the address space, we specify either `uniform` or `storage` in the AS portion. This corresponds to the usage specified for the GPUBuffer. For the AM portion, we specify one of `read`, `write`, or `read_write`, depending on how we want to access it from WGSL.

After the identifier in `var`, we specify the [variable type](https://www.w3.org/TR/WGSL/#plain-types-section) following `:`. There are several types, but in this shader, we're using `u32`, `array<u32>`, and `atomic<u32>`. [`u32`](https://www.w3.org/TR/WGSL/#integer-types) represents a 32-bit unsigned integer and maps to a single-element [`Uint32Array`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) on the JavaScript side. [`array<u32>`](https://www.w3.org/TR/WGSL/#array-types) is an array of 32-bit unsigned integers and maps to a Uint32Array of arbitrary length. [`atomic<u32>`](https://www.w3.org/TR/WGSL/#atomic-types) is also a 32-bit unsigned integer like `u32`, but operations and read/write actions on this variable can be performed atomically. We'll discuss atomic operations later.

#### Writing Results and Atomic Operations

After all this lengthy setup, we can finally assign `GPUBuffer` to WGSL variables. Now we just need to read and write normally within the shader program.

```wgsl
let keyword = 30164u;
let cmp = keyword == data[id.x];

if(cmp) {
    let ptr_pos = atomicAdd(&pointer, 1u);
    result[ptr_pos] = id.x;
}
```

The `30164u` specified in `keyword` represents a decimal uint32 value, which is the Unicode code point for the character "痔" (hemorrhoid). The line `let cmp = keyword == data[id.x];` extracts the 32-bit uint at the comparison position of the search target text using the thread ID accessible via id.x, and compares it with `keyword` to perform a single-character match. Note that the search target text is assumed to be stored as a `Uint32Array` with code points obtained from each character using `String.prototype.charCodeAt()`. [Here's the code reference](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L23-L25).

If the comparison result `cmp` is `true`, we write the match position `id.x` to the `result` buffer. The write position is controlled by `pointer`. We get the `pointer` value, write `id.x` at that position, and increment the `pointer` value for the next write.

There's one point to consider here. In SIMT, many threads are processed simultaneously. As a result, reading, incrementing, and writing to `pointer` might happen simultaneously across multiple threads. Since the order of these operations is not guaranteed, incorrect values might be stored in `pointer`.

To avoid this problem, we use the atomic operations mentioned earlier. `atomicAdd()` ensures that reading, incrementing, and writing to a variable specified with `atomic<>` are performed atomically (without interruption from anyone).

Incidentally, since thread processing order is not fixed, the matching results set in the `result` buffer will be in random order for each execution. In practice, you would often sort them on the JavaScript side.

##### Execution Order of if Statements

There's another noteworthy point to understand. In SIMT, threads share the PC. How are conditional branch instructions (if statements) handled in this context?

Since the comparison result of an if statement varies by thread, true paths and false paths may be mixed in a SIMD operation. When these are mixed, SIMD passes through both paths. The PC increments to traverse both paths, but there are flags that determine execution/non-execution for each VALU, controlling which VALUs are executed through masking. Therefore, when there are many conditions that require traversing both paths, VALU efficiency drops and performance decreases. For better performance in SIMD, it's preferable to have uniform conditional branches. However, given the nature of conditional branches, this can be difficult to arrange in advance.

#### Reading from GPUBuffer

Despite the computation being quite simple, the buffer handling is so complex that this explanation has become quite lengthy. Now that we can finally perform the calculation, all that's left is to read the results! However, there's still more buffer handling required. It's quite involved.

While writing to a `GPUBuffer` was possible by directly issuing commands to the `GPUQueue`, we cannot read from a `GPUBuffer` that's accessible to shaders from the JavaScript side. Instead, we need to create a `GPUBuffer` that JavaScript can read from, and after the shader execution finishes, copy all the data between these `GPUBuffer`s to read the result data from the JavaScript side.

Reading from a `GPUBuffer` requires the following steps:

1. Create a `GPUBuffer` that can be read from JavaScript. Specifically, [create a `GPUBuffer` of the same size as the one you want to read from, with `MAP_READ` and `COPY_DST` specified](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L64-L74)
2. When creating a CommandBuffer, after generating a `GPUComputePass`, [insert a copy command from GPUBuffer to GPUBuffer](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/webgpu/1char.ts#L45-L46) (`copyBufferToBuffer()`)
3. After `GPUQueue.submit()`, [map the `GPUBuffer` asynchronously with `READ` specified via `mapAsync()`](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/webgpu/1char.ts#L56), then [convert it to a `Uint32Array` by getting the mapped range of the `GPUBuffer` with `getMappedRange()` and creating a new `Uint32Array` from it](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/webgpu/1char.ts#L57)
4. Read the data from the created `Uint32Array`

I believe this is similar to a memory-mapped approach, judging by the name.

```typescript
// Encode commands to do the computation
const encoder = device.createCommandEncoder();
const pass = encoder.beginComputePass();
(omitted)
pass.end();

// Encode a command to copy the results to a mappable buffer.
encoder.copyBufferToBuffer(buffers.result, 0, buffers.result_copy, 0, buffers.result.size);
encoder.copyBufferToBuffer(buffers.result_ptr, 0, buffers.result_ptr_copy, 0, buffers.result_ptr.size);
encoder.popDebugGroup();

// Finish encoding and submit the commands
const commandBuffer = encoder.finish();

device.queue.submit([commandBuffer]);

// Read the results
await buffers.result_ptr_copy.mapAsync(GPUMapMode.READ);
const resultPtr = new Uint32Array(buffers.result_ptr_copy.getMappedRange());
```

With this, we can finally execute a program using WebGPU. Well done!

### Exclusive Use of GPU Resources

...or so I'd like to say, but there's one thing I forgot to mention: resource sharing.

`GPUQueue.submit()` is a synchronous function, but `GPUBuffer.mapAsync()`, which reads the results, is asynchronous. The Promise is likely fulfilled after the GPU execution completes. In a browser environment, a context switch occurs immediately after calling `GPUBuffer.mapAsync()`, leading to UI event waiting. This means the next search could be triggered before the GPU processing finishes. The next search will try to process using the same `GPUBuffer`, resulting in resource contention between two GPU processes, which leads to errors. Specifically, the second `GPUBuffer.mapAsync()` call will fail.

I considered two approaches to solve this problem:

1. Generate new `GPUBuffer` objects each time without reusing them
2. Use GPU resources exclusively

Since this is quite a corner case, option 1 seems a bit heavy for regular use. So, I opted for option 2.

Specifically, I implemented a [makeshift Mutex](https://github.com/osawa-naotaka/staticseek/blob/main/src/util/mutex.ts) and [acquire it just before searching with GPU](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L156), then [release it after the GPU search is completely finished](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/gpulinearindex.ts#L209). This should work... hopefully. I say "hopefully" because this makeshift Mutex was generated by an LLM, so I'm not entirely confident in its correctness... If someone could verify it, that would be greatly appreciated...

### Profiling Method

For more detailed profiling of WebGPU programs, [PIX on Windows](https://devblogs.microsoft.com/pix/) can be used. A friend taught me about this tool. By profiling Chrome itself running WebGPU with PIX, you can effectively profile WebGPU. You can follow the instructions on [this site explaining how to take profiles](https://toji.dev/webgpu-profiling/pix.html). Note that PIX may need to be run with administrator privileges.

PIX is primarily a graphics profiler, so settings like "capture 10 frames of profile" are available. However, compute shaders don't have the concept of frames. The timing for capture isn't entirely clear. Due to this uncertainty, I [put the WebGPU code in an infinite loop](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/ref/bench/benchmark_webgpu.ts#L141-L151) so that a profile could be captured at any time.

With standard Chrome, even if you [insert debug labels](https://gpuweb.github.io/gpuweb/#debug-markers), they won't be displayed, making it unclear which program is running at what time. To display the inserted debug labels in PIX, you need to perform the tasks described in the "Enabling Debug Markers" section of the aforementioned site. This involves retrieving a NuGet package and placing a DLL in the directory containing Chrome's executable, which raises security concerns. Since the package owner is Microsoft, I'm assuming it's safe, but those who are concerned might want to avoid this approach. Also, the DLL gets removed with Chrome updates, so you need to replace it each time Chrome updates.

#### Profiling Results for a Simple Character Search Shader

I took profiles of [single character search](https://github.com/osawa-naotaka/staticseek/blob/main/ref/webgpu/1char.wgsl) and another single character search with [memory allocation that loads data 4kbytes apart from adjacent ALU](https://github.com/osawa-naotaka/staticseek/blob/main/ref/webgpu/loop_1char_uniform.wgsl). The size of the search target text is approximately 4MBytes.

![](https://storage.googleapis.com/zenn-user-upload/be2227d4e3e3-20250301.png)
Figure 3: Profiling results for single character search

![](https://storage.googleapis.com/zenn-user-upload/84fe16bc14a8-20250301.png)
Figure 4: Profiling results for code with memory allocation loading data 4kbytes apart from adjacent ALU

Yes! You can't see anything! I apologize! Here's a rough summary of the results:

| Method | Dispatch Time | Copy Time | Total [ms] |
| ------ | ------------- | --------- | ---------- |
| Single character | 55[us] | 1.43[ms] | 1.44[ms] |
| 4kbyte | 158[us] | 1.33[ms] | 1.33[ms] |

Indeed, the Dispatch time (presumably processing time) is 3 times slower when separating by 4kbytes, but the copy time after processing is overwhelmingly longer, making the results somewhat meaningless. Also, when measuring these processes from the JavaScript side, they appeared to take a few ms to 10ms. It seems the overhead is too large compared to how quickly GPU internal processing completes. Although the figure is too small to see, the Wave Occupancy (presumably the operational rate) in the profile was around 70%, indicating there are still bottlenecks.

### Bitap Written in WGSL

Now that we have established a method for implementing search using compute shaders, I went ahead with the implementation. Please compare the [bitap algorithm written in WGSL](https://github.com/osawa-naotaka/staticseek/blob/main/src/method/wgsl/bitap_dist1.wgsl) with the [bitap algorithm written in TypeScript](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/util/algorithm.ts#L108-L143). The general structure should be the same. However, while the TypeScript version loops through `text`, the WGSL version doesn't loop but instead launches threads as mentioned earlier. Also, the `Map` used in the bitap key can't be used in WGSL, so I'm using linear search through an array.

While the GPU bitap doesn't loop through the entire `text`, it launches individual threads for each character position, and [each thread loops through the text starting from its position for the length of the query keyword](https://github.com/osawa-naotaka/staticseek/blob/410f92136bbd81fcb626cefb34cb172ac801a45c/src/method/wgsl/bitap_dist1.wgsl#L21). In other words, if N is the text length and M is the keyword length, the GPU bitap performs O(NM) calculations. In contrast, the CPU bitap has a computational complexity of O(N). There's an M-fold difference in computational complexity, resulting in considerable inefficiency, but I implemented it this way for now. Despite the computational inefficiency, I thought this approach might be faster due to increased data locality between VALUs leading to faster data fetching. Since I haven't implemented an O(N) algorithm on GPU, I currently don't know what the actual performance difference would be.

#### Bitap ISA

As an aside, before benchmarking, I displayed the assembly language result of compiling the shader for RDNA3.5. Even without having an actual Radeon GPU, you can install [Radeon GPU Analyzer](https://gpuopen.com/rga/) and use the `rga` command from the command line to see the assembly language result of compiled shaders. However, it doesn't support compilation from WGSL, so I compiled [code ported to HLSL](https://github.com/osawa-naotaka/staticseek/blob/main/ref/hlsl/bitap_dist3.hlsl).

The rga execution command is as follows:

```sh
rga -s dx12 --offline -c gfx1150 --cs-entry cs --cs-model cs_6_0 --isa isa.txt --cs bitap_dist3.hlsl
```

Here is the [ISA conversion result](https://github.com/osawa-naotaka/staticseek/blob/main/ref/hlsl/bitap_dist3_isa.txt). In the GPU community, assembly language output is referred to as ISA. This differs from the conventional use of the term ISA, which might be confusing, but that's the convention.

I thought I might learn something by getting the ISA, but my limited expertise made it difficult to understand much. I need to study more. I also ported [single character search](https://github.com/osawa-naotaka/staticseek/blob/main/ref/hlsl/linear.hlsl) to HLSL and [generated its ISA](https://github.com/osawa-naotaka/staticseek/blob/main/ref/hlsl/linear_isa.hlsl). This is shorter and clearer, so staring at it might reveal something.

### Benchmarking and Profiling

I ran benchmarks on searching the same 3-4MByte text data as before, now including GPU bitap. The numbers are slightly different as I redid the benchmarks, but the results for methods from the previous time are similar to the earlier figures.

| Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives |
| ------ | ------------- | ---- | --------- | ----------- | ------- | --------------- | --------------- |
| English (Linear) | 334ms | 3,748kbyte | 1,324kbyte | 2.84ms |  |  |  |
| English (CPU bitap) | 278ms | 3,748kbyte | 1,324kbyte | 73.72ms | 58964 | 17924 | 0 |
| English (GPU bitap) | 288ms | 3,748kbyte | 1,324kbyte | 4.47ms | 58964 | 17931 | 0 |
| English (Trie) | 921ms | 3,748kbyte | 506kbyte | 0.30ms | 57762 | 10295 | 1202 |

| Method | Creation Time | Size | gzip Size | Search Time | Matches | False Positives | False Negatives |
| ------ | ------------- | ---- | --------- | ----------- | ------- | --------------- | --------------- |
| Japanese (Linear) | 135ms | 3,020kbyte | 1,053kbyte | 0.29ms |  |  |  |
| Japanese (CPU bitap) | 128ms | 3,020kbyte | 1,053kbyte | 18.14ms | 15437 | 10062 | 0 |
| Japanese (GPU bitap) | 125ms | 3,020kbyte | 1,053kbyte | 3.92ms | 15437 | 10068 | 0 |
| Japanese (Bigram) | 482ms | 3,020kbyte | 813kbyte | 0.93ms | 13375 | 22148 | 2062 |

GPU bitap takes about 4ms/query for both English and Japanese, which is within an acceptable range considering UI responsiveness. It's an order of magnitude slower than Bigram/Trie but an order of magnitude faster than bitap on TypeScript. Also, in the previously conducted single character search benchmark, the execution time was a few ms, and changing to a more complex algorithm like bitap resulted in almost no change in execution time. There seems to be some overhead, but it's not clear what it is.

The match and false positive numbers for CPU bitap and GPU bitap are almost identical, which suggests that GPU bitap is indeed implementing the same logic as CPU bitap. The slight difference is likely because, as mentioned earlier, we don't loop in GPU, so the matching state context isn't shared across search positions, leading to some discrepancies.

![](https://storage.googleapis.com/zenn-user-upload/4c580002235c-20250301.png)

This is the profile of bitap. The yellow indicates the Wave Occupancy of the compute shader, presumably the utilization rate. It's operating intermittently at around 98%.

| Method | Dispatch Time | Copy Time | Total [ms] |
| ------ | ------------- | --------- | ---------- |
| GPU bitap | 620[us] | 160[us] | 780[us] |

The Dispatch time increased compared to single character search, but for some reason, the Copy time was reduced, bringing the Total to under 1ms. However, from the JavaScript side, this still appears to take a few ms of processing time. There seems to be significant overhead somewhere.

Looking at this profile, operations taking around 780us are densely packed. If that's the case, the processing time should appear to be less than 1ms even from the JavaScript side to match the throughput. Why does it slow down? I don't know. Perhaps there's a long garbage collection operation happening somewhere.

### In Conclusion

While there are still many unclear points, I'll conclude for now since we've achieved an order of magnitude speedup compared to CPU bitap. This benchmark was run on an RTX4070, but I also achieved speedup on the GPU integrated in an Intel N100, so I believe this performance improvement can be experienced across a wide range of platforms.
