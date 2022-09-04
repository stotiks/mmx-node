/*
 * mmx_timelord.cpp
 *
 *  Created on: Dec 6, 2021
 *      Author: mad
 */

#include <mmx/TimeLord.h>

#include <vnx/vnx.h>
#include <vnx/Proxy.h>
#include <vnx/Server.h>
#include <vnx/Terminal.h>


int main(int argc, char** argv)
{
	mmx::secp256k1_init();

	std::string mmx_home;
	std::string mmx_network;
	if(auto path = ::getenv("MMX_HOME")) {
		mmx_home = path;
		std::cerr << "MMX_HOME = " << mmx_home << std::endl;
	}
	if(auto path = ::getenv("MMX_NETWORK")) {
		mmx_network = path;
		std::cerr << "MMX_NETWORK = " << mmx_network << std::endl;
	}
	const auto root_path = mmx_home + mmx_network;

	std::map<std::string, std::string> options;
	options["n"] = "node";
	options["node"] = "address";

	vnx::init("mmx_timelord", argc, argv, options);

	std::string node_url = ":11330";
	std::string endpoint = ":11332";

	vnx::read_config("node", node_url);
	vnx::read_config("endpoint", endpoint);

	vnx::Handle<vnx::Proxy> proxy = new vnx::Proxy("Proxy", vnx::Endpoint::from_url(node_url));
	proxy->forward_list = {"Node", "Wallet"};

	{
		vnx::Handle<vnx::Server> module = new vnx::Server("Server", vnx::Endpoint::from_url(endpoint));
		module->use_authentication = true;
		module->default_access = "USER";
		module.start_detached();
	}
	{
		vnx::Handle<vnx::Terminal> module = new vnx::Terminal("Terminal");
		module.start_detached();
	}
	{
		vnx::Handle<mmx::TimeLord> module = new mmx::TimeLord("TimeLord");
		module->storage_path = root_path + module->storage_path;
		proxy->import_list.push_back(module->input_infuse);
		proxy->import_list.push_back(module->input_request);
		proxy->export_list.push_back(module->output_proofs);
		module.start_detached();
	}

	proxy.start();

	vnx::wait();

	mmx::secp256k1_free();

	return 0;
}

